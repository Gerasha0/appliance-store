export const Category = {
  BIG: 'BIG',
  SMALL: 'SMALL',
} as const;

export type Category = typeof Category[keyof typeof Category];

export const PowerType = {
  AC220: 'AC220',
  AC110: 'AC110',
  ACCUMULATOR: 'ACCUMULATOR',
} as const;

export type PowerType = typeof PowerType[keyof typeof PowerType];

export const UserRole = {
  EMPLOYEE: 'EMPLOYEE',
  CLIENT: 'CLIENT',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: number;
  email: string;
  password?: string;
}

export interface Employee extends User {
  firstName: string;
  lastName: string;
  position: string;
}

export interface Client extends User {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  card?: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  address: string;
  country: string;
}

export interface Appliance {
  id: number;
  name: string;
  category: Category;
  model: string;
  manufacturerId: number;
  manufacturer?: Manufacturer;
  powerType: PowerType;
  characteristic?: string;
  description?: string;
  power?: number;
  price: number;
}

export interface OrderRow {
  id: number;
  ordersId: number;
  applianceId: number;
  appliance?: Appliance;
  quantity: number;
  amount: number;
}

export interface Orders {
  id: number;
  clientId: number;
  client?: Client;
  employeeId?: number;
  employee?: Employee;
  approved: boolean;
  orderRows?: OrderRow[];
  totalAmount?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ClientRegistrationDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  card?: string;
}

export interface EmployeeRegistrationDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface ClientRequestDTO {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  card?: string;
}

export interface EmployeeRequestDTO {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface ManufacturerRequestDTO {
  name: string;
  address: string;
  country: string;
}

export interface ApplianceRequestDTO {
  name: string;
  category: Category;
  model: string;
  manufacturerId: number;
  powerType: PowerType;
  characteristic?: string;
  description?: string;
  power?: number;
  price: number;
}

export interface OrderRequestDTO {
  clientId: number;
  orderRows: OrderRowRequestDTO[];
}

export interface OrderRowRequestDTO {
  applianceId: number;
  quantity: number;
  amount?: number;
}

export interface JwtResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
  firstName: string;
  lastName: string;
}

export interface ClientResponseDTO extends Client {}
export interface EmployeeResponseDTO extends Employee {}
export interface ManufacturerResponseDTO extends Manufacturer {}
export interface ApplianceResponseDTO extends Appliance {}
export interface OrderResponseDTO extends Orders {}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Page<T> extends PageResponse<T> {}

export interface ApiError {
  error: string;
  message: string;
  status?: number;
  timestamp?: string;
}