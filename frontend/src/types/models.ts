// Enums
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

// Base User interface
export interface User {
  id: number;
  email: string;
  password?: string;
}

// Employee interface
export interface Employee extends User {
  firstName: string;
  lastName: string;
  position: string;
}

// Client interface
export interface Client extends User {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  card?: string;
}

// Manufacturer interface
export interface Manufacturer {
  id: number;
  name: string;
  address: string;
  country: string;
}

// Appliance interface
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

// OrderRow interface
export interface OrderRow {
  id: number;
  ordersId: number;
  applianceId: number;
  appliance?: Appliance;
  quantity: number;
  amount: number;
}

// Orders interface
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

// DTOs for API requests
export interface LoginRequest {
  email: string;
  password: string;
}

// Registration DTOs (password required)
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

// Update DTOs (password optional)
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
  amount?: number;  // Optional - calculated automatically by backend (price * quantity)
}

// DTOs for API responses
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

// Pagination interface
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Legacy alias for compatibility
export interface Page<T> extends PageResponse<T> {}

// API Error interface
export interface ApiError {
  error: string;
  message: string;
  status?: number;
  timestamp?: string;
}
