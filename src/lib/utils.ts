export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidEmail(email: string): boolean {
  if (!email) return true; // email is optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
