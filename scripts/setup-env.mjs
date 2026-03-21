#!/usr/bin/env node
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

function safeString(value) {
  return typeof value === "string" ? value : "";
}

try {
  const output = execSync("bunx supabase status --output json", {
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
  const parsed = JSON.parse(output);

  const env = [
    "NEXT_PUBLIC_SUPABASE_URL=" + safeString(parsed.API_URL || parsed.apiUrl),
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=" +
      safeString(parsed.ANON_KEY || parsed.anonKey),
    "",
  ].join("\n");

  writeFileSync(".env.local", env, "utf-8");
  log.info("Wrote .env.local from supabase status");
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  log.error("Failed to generate .env.local: " + msg);
  process.exit(1);
}
