import { Transform } from 'class-transformer';

export function Lowercase() {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
