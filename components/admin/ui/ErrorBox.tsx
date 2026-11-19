/** Load/save error, with a hint when the database schema hasn't been applied yet. */
export function ErrorBox({ message }: { message: string }) {
  const missing = /schema cache|does not exist/i.test(message);
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm">
      <p className="font-medium text-danger">{message}</p>
      {missing && (
        <p className="mt-2 text-muted">
          This table or column doesn&apos;t exist yet. Run <code className="text-ink">supabase/schema.sql</code> in the Supabase SQL Editor, then reload.
        </p>
      )}
    </div>
  );
}
