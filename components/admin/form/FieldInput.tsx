"use client";

import type { Field } from "../config/fields";
import { inputCls } from "../ui/styles";
import { UploadInput } from "./UploadInput";
import type { InputValue } from "./values";

/** Renders the right input for a field definition (text, textarea, select, checkbox, upload…). */
export function FieldInput({
  field: f,
  value,
  onChange,
  idPrefix,
  onToast,
}: {
  field: Field;
  value: InputValue;
  onChange: (v: InputValue) => void;
  idPrefix: string;
  onToast: (msg: string, error?: boolean) => void;
}) {
  const id = `${idPrefix}-${f.key}`;
  const wide = f.wide ? "sm:col-span-2" : "";
  const label = (
    <span className="text-xs font-medium text-muted">
      {f.label}
      {f.required && <span className="text-accent-soft"> *</span>}
    </span>
  );
  const help = f.help && <span className="text-[11px] text-subtle">{f.help}</span>;

  if (f.type === "checkbox") {
    return (
      <label htmlFor={id} className={`flex min-h-11 cursor-pointer items-center gap-3 self-end ${wide}`}>
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)}
          className="size-5 accent-accent" />
        <span className="text-sm text-ink">{f.label}</span>
      </label>
    );
  }

  if (f.type === "upload") {
    return <UploadInput id={id} field={f} value={String(value)} onChange={onChange} label={label} help={help} wide={wide} onToast={onToast} />;
  }

  let control: React.ReactNode;
  if (f.type === "textarea" || f.type === "list") {
    control = (
      <textarea id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} required={f.required}
        rows={f.type === "list" ? 4 : 3} placeholder={f.placeholder} className={`${inputCls} resize-y`} />
    );
  } else if (f.type === "select") {
    const opts = f.options ?? [];
    const current = String(value);
    control = (
      <select id={id} value={current} onChange={(e) => onChange(e.target.value)} required={f.required} className={inputCls}>
        {!f.required && <option value="">—</option>}
        {current && !opts.includes(current) && <option value={current}>{current}</option>}
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else {
    // Text fields with `options` get suggestions but still accept any value.
    const listId = f.options ? `${id}-options` : undefined;
    control = (
      <>
        <input id={id} type={f.type === "email" || f.type === "url" || f.type === "number" ? f.type : "text"}
          value={String(value)} onChange={(e) => onChange(e.target.value)} required={f.required}
          placeholder={f.placeholder} className={inputCls} list={listId} />
        {listId && (
          <datalist id={listId}>
            {f.options!.map((o) => <option key={o} value={o} />)}
          </datalist>
        )}
      </>
    );
  }

  return (
    <label htmlFor={id} className={`flex flex-col gap-1.5 ${wide}`}>
      {label}
      {control}
      {help}
    </label>
  );
}
