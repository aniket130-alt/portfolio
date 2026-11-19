import { Mail, Phone } from "lucide-react";

/** Email (mailto:) and phone (tel:) lines under the contact buttons. */
export function ContactDetails({
  email,
  phone,
  phoneLabel,
}: {
  email: string | null;
  phone: string | null;
  phoneLabel: string;
}) {
  if (!email && !phone) return null;
  return (
    <ul className="mt-5 space-y-2 text-sm text-muted">
      {email && (
        <li className="flex items-center gap-2">
          <Mail className="size-4 shrink-0 text-accent-soft" aria-hidden="true" />
          <a href={`mailto:${email}`} className="hover:text-ink">{email}</a>
        </li>
      )}
      {phone && (
        <li className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-accent-soft" aria-hidden="true" />
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} aria-label={`${phoneLabel} ${phone}`} className="hover:text-ink">
            {phone}
          </a>
        </li>
      )}
    </ul>
  );
}
