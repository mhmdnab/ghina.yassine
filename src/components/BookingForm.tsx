"use client";

import { ChevronDown, CircleCheck } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui";
import { site, whatsappLink } from "@/lib/site";

const OPEN_DAYS = site.hours.filter((day) => day.open).map((day) => day.day);

type Fields = { name: string; phone: string; day: string; reason: string };
type Errors = Partial<Record<"name" | "phone", string>>;

function composeMessage({ name, phone, day, reason }: Fields): string {
  const lines = [
    "Hello Dr. Ghina, I would like to book an appointment.",
    "",
    `Name: ${name.trim() || "..."}`,
    `Phone: ${phone.trim() || "..."}`,
    `Preferred day: ${day}`,
  ];
  if (reason.trim()) lines.push(`Reason for the visit: ${reason.trim()}`);
  return lines.join("\n");
}

function validate({ name, phone }: Fields): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a phone number we can reach you on.";
  return errors;
}

const inputStyles =
  "mt-2 block w-full rounded-xl border border-line bg-page px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:border-accent-strong focus:bg-surface focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong";

export function BookingForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>({ name: "", phone: "", day: "Any day", reason: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.phone) return phoneRef.current?.focus();

    const url = whatsappLink(composeMessage(fields));
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const message = composeMessage(fields);

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-note`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="font-medium text-ink">
            Your name
          </label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            value={fields.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={inputStyles}
          />
          {errors.name ? (
            <p id={`${id}-name-error`} className="mt-1.5 text-sm text-accent-strong">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className="font-medium text-ink">
            Phone number
          </label>
          <input
            ref={phoneRef}
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+961"
            value={fields.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputStyles}
          />
          {errors.phone ? (
            <p id={`${id}-phone-error`} className="mt-1.5 text-sm text-accent-strong">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-day`} className="font-medium text-ink">
            Preferred day
          </label>
          <div className="relative">
            <select
              id={`${id}-day`}
              name="day"
              value={fields.day}
              onChange={update("day")}
              className={`${inputStyles} appearance-none pr-11`}
            >
              <option>Any day</option>
              {OPEN_DAYS.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-accent-strong"
            />
          </div>
          <p className="mt-1.5 text-sm text-muted">Open Monday to Saturday, 8:00 AM to 8:00 PM.</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-reason`} className="font-medium text-ink">
            Reason for your visit <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={`${id}-reason`}
            name="reason"
            rows={3}
            maxLength={500}
            value={fields.reason}
            onChange={update("reason")}
            placeholder="For example: a first visit, my child’s visit, or a question about my smile"
            className={`${inputStyles} resize-y`}
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-page p-4">
        <p className="text-sm font-medium text-muted">Your message preview</p>
        <p className="mt-2 whitespace-pre-line text-[0.95rem] text-ink">{message}</p>
      </div>

      <button type="submit" className={`${buttonStyles.primary} mt-6 w-full sm:w-auto`}>
        <WhatsAppIcon size={20} />
        Continue on WhatsApp
      </button>
      <p id={`${id}-note`} className="mt-3 text-sm text-muted">
        Opens WhatsApp with this message. Nothing is sent until you press send.
      </p>

      <div aria-live="polite">
        {sentUrl ? (
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-accent-soft/70 p-4 text-ink">
            <CircleCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-strong" />
            <span>
              WhatsApp should now be open with your message.{" "}
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-strong underline underline-offset-4"
              >
                Open it again
              </a>{" "}
              if it did not appear.
            </span>
          </p>
        ) : null}
      </div>
    </form>
  );
}
