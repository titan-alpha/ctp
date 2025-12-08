import { useState, useCallback, useMemo } from 'react';

export type OperationType = 'query' | 'mutation';

export interface FieldArgument {
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'variable';
}

export interface QueryField {
  id: string;
  name: string;
  alias?: string;
  arguments: FieldArgument[];
  children: QueryField[];
  isExpanded: boolean;
}

export interface GraphQLQuery {
  operationType: OperationType;
  operationName: string;
  variables: { name: string; type: string; defaultValue?: string }[];
  fields: QueryField[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatArgumentValue(arg: FieldArgument): string {
  switch (arg.type) {
    case 'string':
      return `"${arg.value}"`;
    case 'number':
    case 'boolean':
      return arg.value;
    case 'variable':
      return `$${arg.value}`;
    default:
      return arg.value;
  }
}

function buildFieldString(field: QueryField, indent: number): string {
  const indentStr = '  '.repeat(indent);
  let line = indentStr;

  if (field.alias) {
    line += `${field.alias}: `;
  }

  line += field.name;

  if (field.arguments.length > 0) {
    const args = field.arguments
      .filter((a) => a.name && a.value)
      .map((a) => `${a.name}: ${formatArgumentValue(a)}`)
      .join(', ');
    if (args) {
      line += `(${args})`;
    }
  }

  if (field.children.length > 0) {
    line += ' {\n';
    line += field.children.map((child) => buildFieldString(child, indent + 1)).join('\n');
    line += `\n${indentStr}}`;
  }

  return line;
}

function buildQueryString(query: GraphQLQuery): string {
  if (query.fields.length === 0) {
    return '';
  }

  let result = query.operationType;

  if (query.operationName) {
    result += ` ${query.operationName}`;
  }

  if (query.variables.length > 0) {
    const vars = query.variables
      .filter((v) => v.name && v.type)
      .map((v) => {
        let varStr = `$${v.name}: ${v.type}`;
        if (v.defaultValue) {
          varStr += ` = ${v.defaultValue}`;
        }
        return varStr;
      })
      .join(', ');
    if (vars) {
      result += `(${vars})`;
    }
  }

  result += ' {\n';
  result += query.fields.map((field) => buildFieldString(field, 1)).join('\n');
  result += '\n}';

  return result;
}

export function createEmptyField(): QueryField {
  return {
    id: generateId(),
    name: '',
    alias: '',
    arguments: [],
    children: [],
    isExpanded: true,
  };
}

interface UseGraphqlQueryBuilderReturn {
  query: GraphQLQuery;
  queryString: string;
  setOperationType: (type: OperationType) => void;
  setOperationName: (name: string) => void;
  addVariable: () => void;
  updateVariable: (index: number, field: 'name' | 'type' | 'defaultValue', value: string) => void;
  removeVariable: (index: number) => void;
  addField: (parentId?: string) => void;
  updateField: (id: string, updates: Partial<QueryField>) => void;
  removeField: (id: string) => void;
  addArgument: (fieldId: string) => void;
  updateArgument: (fieldId: string, argIndex: number, updates: Partial<FieldArgument>) => void;
  removeArgument: (fieldId: string, argIndex: number) => void;
  toggleFieldExpanded: (id: string) => void;
  resetQuery: () => void;
}

const DEFAULT_QUERY: GraphQLQuery = {
  operationType: 'query',
  operationName: '',
  variables: [],
  fields: [],
};

export function useGraphqlQueryBuilder(): UseGraphqlQueryBuilderReturn {
  const [query, setQuery] = useState<GraphQLQuery>(DEFAULT_QUERY);

  const queryString = useMemo(() => buildQueryString(query), [query]);

  const setOperationType = useCallback((type: OperationType) => {
    setQuery((prev) => ({ ...prev, operationType: type }));
  }, []);

  const setOperationName = useCallback((name: string) => {
    setQuery((prev) => ({ ...prev, operationName: name }));
  }, []);

  const addVariable = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      variables: [...prev.variables, { name: '', type: '', defaultValue: '' }],
    }));
  }, []);

  const updateVariable = useCallback((index: number, field: 'name' | 'type' | 'defaultValue', value: string) => {
    setQuery((prev) => ({
      ...prev,
      variables: prev.variables.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  }, []);

  const removeVariable = useCallback((index: number) => {
    setQuery((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  }, []);

  const updateFieldInTree = (fields: QueryField[], id: string, updates: Partial<QueryField>): QueryField[] => {
    return fields.map((field) => {
      if (field.id === id) {
        return { ...field, ...updates };
      }
      if (field.children.length > 0) {
        return { ...field, children: updateFieldInTree(field.children, id, updates) };
      }
      return field;
    });
  };

  const addFieldToTree = (fields: QueryField[], parentId: string | undefined): QueryField[] => {
    if (!parentId) {
      return [...fields, createEmptyField()];
    }
    return fields.map((field) => {
      if (field.id === parentId) {
        return { ...field, children: [...field.children, createEmptyField()] };
      }
      if (field.children.length > 0) {
        return { ...field, children: addFieldToTree(field.children, parentId) };
      }
      return field;
    });
  };

  const removeFieldFromTree = (fields: QueryField[], id: string): QueryField[] => {
    return fields
      .filter((field) => field.id !== id)
      .map((field) => ({
        ...field,
        children: removeFieldFromTree(field.children, id),
      }));
  };

  const addField = useCallback((parentId?: string) => {
    setQuery((prev) => ({
      ...prev,
      fields: addFieldToTree(prev.fields, parentId),
    }));
  }, []);

  const updateField = useCallback((id: string, updates: Partial<QueryField>) => {
    setQuery((prev) => ({
      ...prev,
      fields: updateFieldInTree(prev.fields, id, updates),
    }));
  }, []);

  const removeField = useCallback((id: string) => {
    setQuery((prev) => ({
      ...prev,
      fields: removeFieldFromTree(prev.fields, id),
    }));
  }, []);

  const addArgument = useCallback((fieldId: string) => {
    setQuery((prev) => ({
      ...prev,
      fields: updateFieldInTree(prev.fields, fieldId, {
        arguments: [
          ...(prev.fields.find((f) => f.id === fieldId)?.arguments || []),
          { name: '', value: '', type: 'string' },
        ],
      }),
    }));
  }, []);

  const updateArgumentInField = (fields: QueryField[], fieldId: string, argIndex: number, updates: Partial<FieldArgument>): QueryField[] => {
    return fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          arguments: field.arguments.map((arg, i) => (i === argIndex ? { ...arg, ...updates } : arg)),
        };
      }
      if (field.children.length > 0) {
        return { ...field, children: updateArgumentInField(field.children, fieldId, argIndex, updates) };
      }
      return field;
    });
  };

  const removeArgumentFromField = (fields: QueryField[], fieldId: string, argIndex: number): QueryField[] => {
    return fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          arguments: field.arguments.filter((_, i) => i !== argIndex),
        };
      }
      if (field.children.length > 0) {
        return { ...field, children: removeArgumentFromField(field.children, fieldId, argIndex) };
      }
      return field;
    });
  };

  const updateArgument = useCallback((fieldId: string, argIndex: number, updates: Partial<FieldArgument>) => {
    setQuery((prev) => ({
      ...prev,
      fields: updateArgumentInField(prev.fields, fieldId, argIndex, updates),
    }));
  }, []);

  const removeArgument = useCallback((fieldId: string, argIndex: number) => {
    setQuery((prev) => ({
      ...prev,
      fields: removeArgumentFromField(prev.fields, fieldId, argIndex),
    }));
  }, []);

  const toggleFieldExpanded = useCallback((id: string) => {
    setQuery((prev) => ({
      ...prev,
      fields: updateFieldInTree(prev.fields, id, {
        isExpanded: !prev.fields.find((f) => f.id === id)?.isExpanded,
      }),
    }));
  }, []);

  const resetQuery = useCallback(() => {
    setQuery(DEFAULT_QUERY);
  }, []);

  return {
    query,
    queryString,
    setOperationType,
    setOperationName,
    addVariable,
    updateVariable,
    removeVariable,
    addField,
    updateField,
    removeField,
    addArgument,
    updateArgument,
    removeArgument,
    toggleFieldExpanded,
    resetQuery,
  };
}
