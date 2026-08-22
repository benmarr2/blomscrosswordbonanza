import { customAlphabet } from 'nanoid';

// Excludes visually ambiguous characters (0/O, 1/I/L).
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const generate = customAlphabet(ALPHABET, 5);

export function generateRoomCode(): string {
  return generate();
}

export function normalizeRoomCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function isValidRoomCode(code: string): boolean {
  return new RegExp(`^[${ALPHABET}]{5}$`).test(code);
}
