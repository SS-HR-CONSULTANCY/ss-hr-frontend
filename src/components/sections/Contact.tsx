import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Heading from "../common/Heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { businessHours, contactData } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { submitEnquiry } from "@/utils/apis/enquiryApi";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: submitEnquiry,
    onSuccess: () => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again later.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(formData);
  }

  return (
    <section id="contact" className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <Heading
          heading="Get in Touch"
          dataaos="fade-down"
          headingDescription="Questions about visas, tickets, recruitment, or attestation? We’re here to help."
          mainDivClassName="text-center mx-auto max-w-2xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
          <Card className="h-full" data-aos="fade-right">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>We'd love to hear from you.</CardDescription>
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
              <div className="rounded-xl border p-3 text-sm text-muted-foreground">
                {businessHours}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full" data-aos="fade-left">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                We typically respond within one business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="firstName" label="First name">
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </Field>
                  <Field id="lastName" label="Last name">
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </Field>
                </div>

                <Field id="email" label="Email">
                  <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Field>

                <Field id="phone" label="Phone (optional)">
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </Field>

                <Field id="subject" label="Subject">
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject} onChange={handleChange}
                    placeholder="Visa inquiry, Tickets, Recruitment…"
                    required
                  />
                </Field>

                <Field id="message" label="Message">
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
                </Field>

                <Button
                  type="submit"
                  className="w-full sm:w-auto cursor-pointer"
                  disabled={mutation.isPending}
                >
                  <Send className="mr-2 size-4" />
                  {mutation.isPending ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-10" data-aos="fade-up">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle>Find Us Here</CardTitle>
                  <CardDescription>
                    Abu Saif Business Center, Al Kazim Building — Al Qiyadah Metro Station Exit 2, Entrance B, Dubai, UAE
                  </CardDescription>
                </div>
                <a
                  href="https://maps.app.goo.gl/CVHTy3H9NNVrkw9n8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <iframe
                title="SS HR Consultancy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.7569818325187!2d55.347243180137944!3d25.27875922005254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d3945927241%3A0xec15a179df5da7c0!2sSS%20HR%20Consultancy%20Tours%20and%20%20Travels!5e0!3m2!1sen!2sin!4v1774616039650!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
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
    <a href={href} className="block hover:opacity-90 transition-opacity">
      {content}
    </a>
  ) : (
    content
  );
}
