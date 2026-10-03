import en from "@/i18n/en.json";
const dict: Record<string, string> = en;
// To add a language later: create src/i18n/xx.json and pick it here.
export function t(key: string, vars: Record<string, string | number> = {}): string {
  let s = dict[key] ?? key;
  for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
  return s;
}
