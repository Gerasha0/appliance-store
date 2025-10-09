import * as yup from 'yup';
import { Category, PowerType } from './models';

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

// Client validation schema
export const clientSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'First name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Last name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^[\d\s\-+()]+$/,
      'Phone number must contain only digits, spaces, hyphens, plus signs, and parentheses'
    )
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters'),
  card: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .matches(
      /^(\d{16}|\d{4}-\d{4}-\d{4}-\d{4})$/,
      'Card must be 16 digits or formatted as XXXX-XXXX-XXXX-XXXX'
    ),
});

// Client registration schema (for registration without ID)
export const clientRegistrationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'First name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Last name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^[\d\s\-+()]+$/,
      'Phone number must contain only digits, spaces, hyphens, plus signs, and parentheses'
    )
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters'),
});

// Employee validation schema
export const employeeSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'First name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Last name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),
});

// Employee registration schema
export const employeeRegistrationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'First name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Last name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),
});

// Manufacturer validation schema
export const manufacturerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters'),
  country: yup
    .string()
    .required('Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must not exceed 100 characters'),
});

// Appliance validation schema
export const applianceSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  category: yup
    .string()
    .oneOf([Category.BIG, Category.SMALL], 'Invalid category')
    .required('Category is required'),
  model: yup
    .string()
    .required('Model is required')
    .min(1, 'Model must be at least 1 character')
    .max(100, 'Model must not exceed 100 characters'),
  manufacturerId: yup.number().required('Manufacturer is required').positive('Manufacturer ID must be positive'),
  powerType: yup
    .string()
    .oneOf([PowerType.AC220, PowerType.AC110, PowerType.ACCUMULATOR], 'Invalid power type')
    .required('Power type is required'),
  characteristic: yup
    .string()
    .optional()
    .max(500, 'Characteristic must not exceed 500 characters'),
  description: yup
    .string()
    .optional()
    .max(1000, 'Description must not exceed 1000 characters'),
  power: yup
    .number()
    .optional()
    .positive('Power must be positive')
    .min(0.1, 'Power must be at least 0.1'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(0.01, 'Price must be at least 0.01'),
});

// Order Row validation schema
export const orderRowSchema = yup.object({
  applianceId: yup.number().required('Appliance is required').positive('Appliance ID must be positive'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
});

// Order validation schema
export const orderSchema = yup.object({
  clientId: yup.number().required('Client is required').positive('Client ID must be positive'),
  orderRows: yup
    .array()
    .of(orderRowSchema)
    .min(1, 'Order must have at least one item')
    .required('Order items are required'),
});

// Change password schema
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});
