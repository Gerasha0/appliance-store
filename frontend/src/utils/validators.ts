export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'Password must be at least 8 characters long',
    };
  }

  let strength = 0;

  if (/[a-z]/.test(password)) strength++;

  if (/[A-Z]/.test(password)) strength++;

  if (/\d/.test(password)) strength++;

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength < 2) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.',
    };
  } else if (strength < 4) {
    return {
      isValid: true,
      strength: 'medium',
      message: 'Password strength is medium',
    };
  } else {
    return {
      isValid: true,
      strength: 'strong',
      message: 'Password strength is strong',
    };
  }
};

export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(cleaned)) return false;

  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

export const isValidAge = (
  birthDate: Date,
  minAge: number = 0,
  maxAge: number = 150
): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

  return actualAge >= minAge && actualAge <= maxAge;
};