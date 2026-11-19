import type { Field } from "../config/fields";

export type InputValue = string | boolean;

/** DB value → what the input shows (arrays become lines / comma lists). */
export function toInput(f: Field, v: unknown): InputValue {
  if (f.type === "checkbox") return Boolean(v);
  if (f.type === "list") return Array.isArray(v) ? v.join("\n") : "";
  if (f.type === "tags") return Array.isArray(v) ? v.join(", ") : "";
  return v == null ? "" : String(v);
}

/** Input value → DB value (empty text becomes null). */
export function fromInput(f: Field, v: InputValue): unknown {
  if (f.type === "checkbox") return Boolean(v);
  const s = String(v);
  if (f.type === "list") return s.split("\n").map((x) => x.trim()).filter(Boolean);
  if (f.type === "tags") return s.split(",").map((x) => x.trim()).filter(Boolean);
  if (f.type === "number") return s.trim() === "" ? null : Number(s);
  return s.trim() === "" ? null : s.trim();
}
