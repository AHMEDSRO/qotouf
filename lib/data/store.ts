import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

/**
 * Reads a named JSON collection from .data/, seeding it from `seed()` on first
 * access. This file-backed store is what lets dashboard edits (bulk import, new
 * orders, role/customer changes) survive a `npm run dev` restart in Phase 1,
 * ahead of the eventual Supabase swap-in.
 */
export function readCollection<T>(name: string, seed: () => T[]): T[] {
  ensureDataDir();
  const file = filePath(name);
  if (!fs.existsSync(file)) {
    const initial = seed();
    fs.writeFileSync(file, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw) as T[];
}

export function writeCollection<T>(name: string, data: T[]): void {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
}
