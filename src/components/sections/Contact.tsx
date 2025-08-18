import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Heading from "../common/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { businessHours, contactData } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Contact() {

  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: send to your API / form service
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <section id="contact" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Heading
          heading='Get in Touch'
          headingDescription='Questions about visas, tickets, recruitment, or attestation? We’re here to help.'
          mainDivClassName='text-center mx-auto max-w-2xl'
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>We’d love to hear from you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactData.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <InfoRow
                    key={idx}
                    icon={<Icon className="size-5" />}
                    label={item.label}
                    value={item.value}
                    href={item.href}
                  />
                );
              })}
              <div className="rounded-xl border p-3 text-sm text-muted-foreground">{businessHours}</div>
            </CardContent>
          </Card>


          <Card className="h-full">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>We typically respond within one business day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="firstName" label="First name">
                    <Input id="firstName" name="firstName" required />
                  </Field>
                  <Field id="lastName" label="Last name">
                    <Input id="lastName" name="lastName" required />
                  </Field>
                </div>

                <Field id="email" label="Email">
                  <Input id="email" type="email" name="email" required />
                </Field>

                <Field id="phone" label="Phone (optional)">
                  <Input id="phone" name="phone" />
                </Field>

                <Field id="subject" label="Subject">
                  <Input id="subject" name="subject" placeholder="Visa inquiry, Tickets, Recruitment…" required />
                </Field>

                <Field id="message" label="Message">
                  <Textarea id="message" name="message" rows={5} required />
                </Field>

                <Button type="submit" className="w-full sm:w-auto cursor-pointer" disabled={loading}>
                  <Send className="mr-2 size-4" />
                  {loading ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="rounded-md border p-2">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-90 transition-opacity">{content}</a>
  ) : (
    content
  );
}
