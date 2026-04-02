/**
 * GameForge Patch System — applies search-and-replace blocks to existing game code.
 * Used for iterations: Claude outputs only changed parts, not the entire file.
 */

export interface Patch {
  search: string;
  replace: string;
}

/**
 * Parse Claude's response for <<<SEARCH...=======...>>>REPLACE blocks.
 * Returns empty array if no patches found (triggers full-file fallback).
 */
export function extractPatches(text: string): Patch[] {
  const patches: Patch[] = [];
  const SEARCH_START = "<<<SEARCH";
  const SEPARATOR = "=======";
  const REPLACE_END = ">>>REPLACE";

  let cursor = 0;
  while (cursor < text.length) {
    const searchIdx = text.indexOf(SEARCH_START, cursor);
    if (searchIdx === -1) break;

    const sepIdx = text.indexOf(`\n${SEPARATOR}\n`, searchIdx);
    if (sepIdx === -1) break;

    const replaceEndIdx = text.indexOf(`\n${REPLACE_END}`, sepIdx);
    if (replaceEndIdx === -1) break;

    const search = text.slice(searchIdx + SEARCH_START.length + 1, sepIdx).trim();
    const replace = text.slice(sepIdx + SEPARATOR.length + 2, replaceEndIdx).trim();

    if (search) {
      patches.push({ search, replace });
    }

    cursor = replaceEndIdx + REPLACE_END.length;
  }

  return patches;
}

/**
 * Apply patches to existing game code using search-and-replace.
 * Matching strategy: exact match first, then whitespace-normalized match.
 */
export function applyPatches(
  gameCode: string,
  patches: Patch[]
): { code: string; applied: number; failed: number } {
  let code = gameCode;
  let applied = 0;
  let failed = 0;

  for (const patch of patches) {
    // Try exact match first
    if (code.includes(patch.search)) {
      code = code.replace(patch.search, patch.replace);
      applied++;
      continue;
    }

    // Fallback: whitespace-normalized match (collapse runs of whitespace)
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
    const normalizedSearch = normalize(patch.search);
    const lines = code.split("\n");
    let matched = false;

    // Sliding window over lines to find the normalized match
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j <= Math.min(i + patch.search.split("\n").length + 5, lines.length); j++) {
        const block = lines.slice(i, j).join("\n");
        if (normalize(block) === normalizedSearch) {
          code = code.replace(block, patch.replace);
          matched = true;
          applied++;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      failed++;
    }
  }

  return { code, applied, failed };
}
