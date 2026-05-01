import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DotmCircular5 } from "@/components/ui/dotm-circular-5";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { tryTiers } from "@/lib/landing-content";
import { submitTry } from "@/lib/try";

const schema = z.object({
  email: z.string().email("Use a valid work email"),
  tier: z.enum(["free", "plus", "enterprise"])
});

type TryValues = z.infer<typeof schema>;

export default function Try() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<TryValues["tier"]>("plus");
  const [emailError, setEmailError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, tier });
    if (!parsed.success) {
      setEmailError(parsed.error.flatten().fieldErrors.email?.[0] ?? "Use a valid work email");
      return;
    }
    setEmailError("");
    setSubmitting(true);
    const result = await submitTry(parsed.data);
    setSubmitting(false);
    toast.success(result.message);
    setEmail("");
  }

  return (
    <PageShell>
      <Seo
        title="Realise true value in 30 days — Ubik"
        description="Request early access to run one Ubik workflow above your existing CRM, programs, ERP, inbox, and sales stack."
        canonical="https://theubik.com/try"
      />
      <main className="relative overflow-hidden">
        <MatrixField variant="hero" density="medium" seed="try-workflow" />
        <div className="container-page section-y relative z-10">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/">
              <ArrowLeftIcon data-icon="inline-start" />
              Back to landing
            </Link>
          </Button>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">Founder-led rollout</Badge>
            <h1 className="text-5xl font-semibold leading-tight">
              Realise true value in 30 days.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              The v1 journey is an early-access request for teams that want to pilot a sales
              follow-up, PO review, shipment exception, approval packet, or ERP-ready handoff
              before expanding.
            </p>
            <div className="grid gap-px bg-border sm:grid-cols-3">
              {tryTiers.map(({ name, title, copy }) => (
                <Card key={name} className="border-0">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit">{name}</Badge>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{copy}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Talk to founders</CardTitle>
              <CardDescription>We will reply within one business day.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={!!emailError}
                  />
                  {emailError ? (
                    <p className="text-sm text-destructive">{emailError}</p>
                  ) : null}
                </div>
                <Tabs
                  value={tier}
                  onValueChange={(value: string) => {
                    const nextTier = value as TryValues["tier"];
                    setTier(nextTier);
                  }}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="free">Free</TabsTrigger>
                    <TabsTrigger value="plus">Plus</TabsTrigger>
                    <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                  </TabsList>
                  <TabsContent value="free" className="text-sm text-muted-foreground">One workspace, one operator queue.</TabsContent>
                  <TabsContent value="plus" className="text-sm text-muted-foreground">
                    One live pilot for inquiries, purchase orders, logistics exceptions, or quality packets.
                  </TabsContent>
                  <TabsContent value="enterprise" className="text-sm text-muted-foreground">
                    Founder-led rollout with security review, admin approval, data boundaries, and ERP handoff.
                  </TabsContent>
                </Tabs>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <DotmCircular5 size={18} dotSize={3} aria-label="Submitting" /> : <CheckCircleIcon data-icon="inline-start" />}
                  {isSubmitting ? "Submitting..." : "Request founder walkthrough"}
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
