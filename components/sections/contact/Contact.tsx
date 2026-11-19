import { Mail } from "lucide-react";
import { isOn, type SiteText } from "@/lib/siteText";
import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ContactDetails } from "./ContactDetails";
import { ContactForm } from "./ContactForm";

export function Contact({ profile, t }: { profile: Profile; t: SiteText }) {
  const showForm = isOn(t.show_contact_form);

  return (
    <Section id="contact">
      <Reveal className="card relative overflow-hidden p-6 sm:p-8 md:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-accent/20 blur-[100px]" />
        <div className={`relative grid gap-10 ${showForm ? "lg:grid-cols-[1fr_1.1fr]" : ""}`}>
          <div>
            <SectionHeading id="contact-title" lead={t.contact_lead} accent={t.contact_accent} />
            <p className="-mt-4 text-2xl font-bold tracking-tight md:text-3xl">{t.contact_heading}</p>
            {profile.reply_note && <p className="mt-3 max-w-md text-muted">{profile.reply_note}</p>}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="btn-primary">
                  <Mail className="size-4" aria-hidden="true" /> {t.contact_email_button}
                </a>
              )}
              <SocialLinks profile={profile} size="lg" />
            </div>

            <ContactDetails email={profile.email} phone={profile.phone} phoneLabel={t.contact_phone_label} />
          </div>

          {showForm && (
            <div className="relative rounded-[var(--radius-card)] border border-line bg-bg/50 p-5 sm:p-6">
              <ContactForm
                labels={{
                  title: t.form_title, name: t.form_name, email: t.form_email, message: t.form_message,
                  submit: t.form_submit, sending: t.form_sending, success: t.form_success, error: t.form_error,
                }}
              />
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
