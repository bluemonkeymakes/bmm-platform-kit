import { useState } from "react";
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useActionData, Form, useNavigation } from "react-router";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H1, Lead } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { FadeIn } from "~/components/common/MotionWrapper";
import { generateToken, validateCsrf, createTokenCookie } from "~/lib/csrf.server";
import { verifyTurnstile } from "~/lib/turnstile.server";
import { contactSchema } from "~/lib/contact-schema";

export const meta: MetaFunction = () => [
  { title: "Contact | Starter Kit" },
  { name: "description", content: "Get in touch with us." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const csrfToken = generateToken();
  return new Response(
    JSON.stringify({
      csrfToken,
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await createTokenCookie(csrfToken),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // 1. Turnstile (if configured)
  const turnstileToken = formData.get("cf-turnstile-response") as string | null;
  const turnstileValid = await verifyTurnstile(turnstileToken);
  if (!turnstileValid) return { success: true }; // Silent rejection

  // 2. CSRF token + timing check
  const csrfValid = await validateCsrf(request, formData.get("_csrf"));
  if (!csrfValid) return { success: true }; // Silent rejection

  // 3. Honeypot
  const honeypot = formData.get("website_url");
  if (honeypot) return { success: true }; // Silent rejection

  // 4. Validate
  const raw = Object.fromEntries(formData);
  const result = contactSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // 5. Submit to API
  const apiUrl = process.env.API_URL || "http://localhost:4001";
  const apiKey = process.env.INTERNAL_API_KEY || "";

  try {
    await fetch(`${apiUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(result.data),
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
  }

  return { success: true };
}

export default function Contact() {
  const { csrfToken, turnstileSiteKey } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData?.success) {
    return (
      <Section>
        <Container size="narrow" className="text-center">
          <FadeIn>
            <H1>Thank you!</H1>
            <Lead className="mt-4">We've received your message and will be in touch soon.</Lead>
          </FadeIn>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <section className="border-b bg-muted/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <H1>Contact Us</H1>
            <Lead className="mt-4">We'd love to hear from you.</Lead>
          </FadeIn>
        </Container>
      </section>

      <Section>
        <Container size="narrow">
          <FadeIn>
            <Form method="post" className="space-y-6">
              <input type="hidden" name="_csrf" value={csrfToken} />

              {/* Honeypot — hidden from real users */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required className="mt-1" />
                  {actionData?.errors?.firstName && (
                    <p className="mt-1 text-sm text-destructive">{actionData.errors.firstName[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required className="mt-1" />
                  {actionData?.errors?.lastName && (
                    <p className="mt-1 text-sm text-destructive">{actionData.errors.lastName[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
                {actionData?.errors?.email && (
                  <p className="mt-1 text-sm text-destructive">{actionData.errors.email[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" name="company" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={5} required className="mt-1" />
                {actionData?.errors?.message && (
                  <p className="mt-1 text-sm text-destructive">{actionData.errors.message[0]}</p>
                )}
              </div>

              {/* Turnstile widget — only rendered if site key is set */}
              {turnstileSiteKey && (
                <>
                  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                  <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="auto" />
                </>
              )}

              <Button type="submit" size="lg" loading={isSubmitting}>
                Send Message
              </Button>
            </Form>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
