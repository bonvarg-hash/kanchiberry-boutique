"use client";

import { useState, type FormEvent } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "prototype">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // No newsletter service is connected; validate and say so plainly.
    setStatus(EMAIL.test(email.trim()) ? "prototype" : "error");
  };

  return (
    <section aria-labelledby="letters-title" className="theme-dark bg-ivory py-16 md:py-24 lg:py-32">
      <div className="wrap grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <h2 id="letters-title" className="section-title text-white">
            Letters From
            <br />
            Kanchiberry
          </h2>
          <p className="lede mt-5 text-[#4E3F47]!">Discover new collections, beautiful weaves, and stories from the world of Indian textiles.</p>
        </div>
        <form onSubmit={submit} noValidate className="w-full max-w-lg md:justify-self-end">
          <label htmlFor="nl-email" className="eyebrow mb-3 block">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="nl-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby="nl-msg nl-privacy"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Subscribe
            </button>
          </div>
          <p id="nl-msg" role="status" className="mt-3 min-h-6 text-sm">
            {status === "error" && <span className="text-danger">Please enter a valid email address, like name@example.com.</span>}
            {status === "prototype" && (
              <span>
                That address looks good. <strong className="font-medium">This is a prototype</strong>: no newsletter service is connected yet, so you
                have not been subscribed.
              </span>
            )}
          </p>
          <p id="nl-privacy" className="text-xs text-[#4E3F47]">
            We’ll only use your email to send Letters From Kanchiberry, and you can unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}
