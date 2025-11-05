export class AuthDto {
  readonly key: string;
  readonly reader: string;
  readonly method?: string; // Optional for backward compatibility
}
