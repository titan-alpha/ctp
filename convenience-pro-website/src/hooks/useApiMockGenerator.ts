import { useState, useCallback } from 'react';

export type DataType = 'user' | 'product' | 'order' | 'post';

export interface UserFields {
  id: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  avatar: boolean;
  createdAt: boolean;
}

export interface ProductFields {
  id: boolean;
  name: boolean;
  description: boolean;
  price: boolean;
  category: boolean;
  stock: boolean;
  image: boolean;
  rating: boolean;
}

export interface OrderFields {
  id: boolean;
  userId: boolean;
  products: boolean;
  total: boolean;
  status: boolean;
  shippingAddress: boolean;
  createdAt: boolean;
}

export interface PostFields {
  id: boolean;
  title: boolean;
  body: boolean;
  authorId: boolean;
  tags: boolean;
  likes: boolean;
  createdAt: boolean;
}

export type FieldsMap = {
  user: UserFields;
  product: ProductFields;
  order: OrderFields;
  post: PostFields;
};

export const DEFAULT_FIELDS: FieldsMap = {
  user: { id: true, name: true, email: true, phone: true, address: true, avatar: true, createdAt: true },
  product: { id: true, name: true, description: true, price: true, category: true, stock: true, image: true, rating: true },
  order: { id: true, userId: true, products: true, total: true, status: true, shippingAddress: true, createdAt: true },
  post: { id: true, title: true, body: true, authorId: true, tags: true, likes: true, createdAt: true },
};

const FIRST_NAMES = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Park Ave'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Seattle', 'Denver', 'Boston'];
const PRODUCT_NAMES = ['Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Hub', 'Mechanical Keyboard', 'Gaming Mouse', 'Webcam HD', 'Monitor Light'];
const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books', 'Toys', 'Beauty', 'Food'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const POST_TITLES = ['Getting Started with React', 'Best Practices for API Design', 'Understanding TypeScript', 'Building Scalable Apps', 'CSS Grid Tutorial'];
const TAGS = ['javascript', 'react', 'typescript', 'nodejs', 'css', 'html', 'web', 'programming'];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateDate(): string {
  const now = Date.now();
  const past = now - randomNumber(0, 365 * 24 * 60 * 60 * 1000);
  return new Date(past).toISOString();
}

function generateUser(fields: UserFields): Record<string, unknown> {
  const user: Record<string, unknown> = {};
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);

  if (fields.id) user.id = generateUUID();
  if (fields.name) user.name = `${firstName} ${lastName}`;
  if (fields.email) user.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  if (fields.phone) user.phone = `+1-${randomNumber(200, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
  if (fields.address) user.address = {
    street: `${randomNumber(100, 9999)} ${randomElement(STREETS)}`,
    city: randomElement(CITIES),
    state: 'CA',
    zip: `${randomNumber(10000, 99999)}`,
  };
  if (fields.avatar) user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`;
  if (fields.createdAt) user.createdAt = generateDate();

  return user;
}

function generateProduct(fields: ProductFields): Record<string, unknown> {
  const product: Record<string, unknown> = {};

  if (fields.id) product.id = generateUUID();
  if (fields.name) product.name = randomElement(PRODUCT_NAMES);
  if (fields.description) product.description = `High quality ${randomElement(PRODUCT_NAMES).toLowerCase()} for everyday use.`;
  if (fields.price) product.price = parseFloat((Math.random() * 500 + 10).toFixed(2));
  if (fields.category) product.category = randomElement(CATEGORIES);
  if (fields.stock) product.stock = randomNumber(0, 500);
  if (fields.image) product.image = `https://picsum.photos/seed/${generateId()}/400/300`;
  if (fields.rating) product.rating = parseFloat((Math.random() * 4 + 1).toFixed(1));

  return product;
}

function generateOrder(fields: OrderFields): Record<string, unknown> {
  const order: Record<string, unknown> = {};

  if (fields.id) order.id = generateUUID();
  if (fields.userId) order.userId = generateUUID();
  if (fields.products) order.products = Array.from({ length: randomNumber(1, 4) }, () => ({
    productId: generateUUID(),
    quantity: randomNumber(1, 5),
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  }));
  if (fields.total) order.total = parseFloat((Math.random() * 500 + 20).toFixed(2));
  if (fields.status) order.status = randomElement(ORDER_STATUSES);
  if (fields.shippingAddress) order.shippingAddress = {
    street: `${randomNumber(100, 9999)} ${randomElement(STREETS)}`,
    city: randomElement(CITIES),
    state: 'CA',
    zip: `${randomNumber(10000, 99999)}`,
  };
  if (fields.createdAt) order.createdAt = generateDate();

  return order;
}

function generatePost(fields: PostFields): Record<string, unknown> {
  const post: Record<string, unknown> = {};

  if (fields.id) post.id = generateUUID();
  if (fields.title) post.title = randomElement(POST_TITLES);
  if (fields.body) post.body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  if (fields.authorId) post.authorId = generateUUID();
  if (fields.tags) post.tags = Array.from({ length: randomNumber(2, 5) }, () => randomElement(TAGS)).filter((v, i, a) => a.indexOf(v) === i);
  if (fields.likes) post.likes = randomNumber(0, 1000);
  if (fields.createdAt) post.createdAt = generateDate();

  return post;
}

interface UseApiMockGeneratorReturn {
  jsonOutput: string;
  generate: <T extends DataType>(dataType: T, fields: FieldsMap[T], count: number) => void;
}

export function useApiMockGenerator(): UseApiMockGeneratorReturn {
  const [jsonOutput, setJsonOutput] = useState<string>('');

  const generate = useCallback(<T extends DataType>(dataType: T, fields: FieldsMap[T], count: number) => {
    const generators: Record<DataType, (f: FieldsMap[DataType]) => Record<string, unknown>> = {
      user: (f) => generateUser(f as UserFields),
      product: (f) => generateProduct(f as ProductFields),
      order: (f) => generateOrder(f as OrderFields),
      post: (f) => generatePost(f as PostFields),
    };

    const data = count === 1
      ? generators[dataType](fields)
      : Array.from({ length: count }, () => generators[dataType](fields));

    setJsonOutput(JSON.stringify(data, null, 2));
  }, []);

  return { jsonOutput, generate };
}
