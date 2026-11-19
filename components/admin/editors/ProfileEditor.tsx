"use client";

import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "../AdminContext";
import { PROFILE_FIELDS, type Field } from "../config/fields";
import { RecordForm } from "../form/RecordForm";
import { Loading } from "../ui/EmptyState";
import { ErrorBox } from "../ui/ErrorBox";

/** Edits fields of the single `profile` row (Profile tab, and the About tab's bio/image). */
export function ProfileEditor({ fields = PROFILE_FIELDS }: { fields?: Field[] }) {
  const { toast, refresh } = useAdmin();
  const db = browserClient();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.from("profile").select("*").eq("id", 1).maybeSingle().then(({ data, error }) => {
      if (error) setError(error.message);
      else setRow(data ?? { id: 1 });
    });
  }, [db]);

  if (error) return <ErrorBox message={error} />;
  if (!row) return <Loading />;

  return (
    <div className="card p-4 sm:p-6">
      <RecordForm
        fields={fields}
        row={row}
        onSave={async (values) => {
          // Row exists → UPDATE only these fields. (An upsert tries an INSERT first and fails on
          // required columns like `name` when this form only edits part of the row.)
          const exists = "name" in row;
          const { data, error } = exists
            ? await db.from("profile").update(values).eq("id", 1).select().single()
            : await db.from("profile").insert({ id: 1, ...values }).select().single();
          if (error) { toast(error.message, true); return false; }
          setRow(data);
          refresh();
          return true;
        }}
      />
    </div>
  );
}
