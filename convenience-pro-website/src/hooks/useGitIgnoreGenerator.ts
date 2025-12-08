import { useState, useCallback } from 'react';

export type Framework = 'node' | 'python' | 'java' | 'go' | 'rust' | 'react' | 'nextjs';
export type OS = 'macos' | 'windows' | 'linux';
export type IDE = 'vscode' | 'intellij' | 'vim';

interface UseGitIgnoreGeneratorReturn {
  content: string;
  generate: (frameworks: Framework[], os: OS[], ides: IDE[]) => void;
  reset: () => void;
}

const FRAMEWORK_TEMPLATES: Record<Framework, string> = {
  node: `# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn
.pnpm-store/
package-lock.json
yarn.lock
pnpm-lock.yaml
.env
.env.local
.env.*.local
dist/
build/
coverage/
.cache/`,

  python: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
ENV/
.env
*.egg-info/
dist/
build/
.eggs/
.pytest_cache/
.coverage
htmlcov/
.tox/
.mypy_cache/
.ruff_cache/`,

  java: `# Java
*.class
*.jar
*.war
*.ear
*.nar
target/
.gradle/
build/
out/
.settings/
.project
.classpath
*.log
hs_err_pid*`,

  go: `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/
bin/
.env`,

  rust: `# Rust
/target/
Cargo.lock
*.rs.bk
*.pdb`,

  react: `# React
node_modules/
build/
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
coverage/
.cache/`,

  nextjs: `# Next.js
.next/
out/
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
coverage/
.turbo/`,
};

const OS_TEMPLATES: Record<OS, string> = {
  macos: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes
.fseventsd`,

  windows: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.lnk`,

  linux: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,
};

const IDE_TEMPLATES: Record<IDE, string> = {
  vscode: `# VS Code
.vscode/
*.code-workspace
.history/`,

  intellij: `# IntelliJ IDEA
.idea/
*.iml
*.iws
*.ipr
out/
.idea_modules/`,

  vim: `# Vim
*.swp
*.swo
*~
.netrwhist
tags`,
};

export function useGitIgnoreGenerator(): UseGitIgnoreGeneratorReturn {
  const [content, setContent] = useState<string>('');

  const generate = useCallback((frameworks: Framework[], os: OS[], ides: IDE[]) => {
    const sections: string[] = [];

    // Add framework patterns
    frameworks.forEach((fw) => {
      if (FRAMEWORK_TEMPLATES[fw]) {
        sections.push(FRAMEWORK_TEMPLATES[fw]);
      }
    });

    // Add OS patterns
    os.forEach((o) => {
      if (OS_TEMPLATES[o]) {
        sections.push(OS_TEMPLATES[o]);
      }
    });

    // Add IDE patterns
    ides.forEach((ide) => {
      if (IDE_TEMPLATES[ide]) {
        sections.push(IDE_TEMPLATES[ide]);
      }
    });

    const result = sections.join('\n\n');
    setContent(result);
  }, []);

  const reset = useCallback(() => {
    setContent('');
  }, []);

  return {
    content,
    generate,
    reset,
  };
}
