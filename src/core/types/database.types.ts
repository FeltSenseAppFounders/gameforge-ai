// database.types.ts
// Placeholder — will be replaced by auto-generated types via `bun run db:gen-types`
// For now, use the manual types in index.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
