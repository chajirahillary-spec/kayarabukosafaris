"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "invalid" | "done";

/**
 * TODO(backend): POST to a server route that writes to
 * organizations/{orgId}/newsletterSubscribers. For now this validates only.
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <form
      noValidate
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "");
        setStatus(/^\S+@\S+\.\S+$/.test(email) ? "done" : "invalid");
      }}
    >
      <label htmlFor={compact ? "nl-footer" : "nl-main"} className="sr-only">
        Email address
      </label>
      <input
        id={compact ? "nl-footer" : "nl-main"}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Your email"
        aria-invalid={status === "invalid"}
        aria-describedby="nl-msg"
        className="h-11 w-full rounded-ka border border-cream/40 bg-transparent px-3 text-sm text-ivory placeholder:text-cream/60"
      />
      <Button type="submit" variant="light" className="w-full">
        Subscribe
      </Button>
      <p id="nl-msg" role="status" className="min-h-4 text-[12px] text-cream/80">
        {status === "invalid" && "Please enter a valid email address."}
        {status === "done" && "Thank you — newsletter sign-up will be connected shortly."}
      </p>
    </form>
  );
}
