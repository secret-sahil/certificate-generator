import { Transform } from 'class-transformer';

export function Capitalise() {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? // Capitalise the first letter of each word
        value.replace(/\b\w/g, (char) => char.toUpperCase())
      : value,
  );
}
