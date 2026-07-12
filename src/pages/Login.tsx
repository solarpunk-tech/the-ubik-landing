import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, Eye, EyeSlash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DotmCircular5 } from "@/components/ui/dotm-circular-5";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { trackEvent } from "@/lib/posthog";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginValues = z.infer<typeof schema>;

export default function Login() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setEmailError(fieldErrors.email?.[0] ?? "");
      setPasswordError(fieldErrors.password?.[0] ?? "");
      return;
    }
    
    setEmailError("");
    setPasswordError("");
    setSubmitting(true);
    
    // Simulate login - in real app this would call an auth API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    toast.success("Welcome back! Logging in...");
    trackEvent("login_attempt", { email: parsed.data.email });
  }

  return (
    <PageShell>
      <Seo
        title="Login | Ubik"
        description="Sign in to your Ubik workspace for perishable trade operations."
        canonical="https://theubik.com/login"
      />
      <main className="relative overflow-hidden">
        <MatrixField variant="hero" density="low" seed="login-animated" />
        <div className="container-page section-y relative z-10">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/">
              <ArrowLeftIcon data-icon="inline-start" />
              Back to landing
            </Link>
          </Button>
          
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col gap-6">
              <Badge variant="secondary" className="w-fit">Secure Access</Badge>
              <h1 className="text-5xl font-semibold leading-tight">Welcome Back</h1>
              <p className="text-lg leading-8 text-foreground/72 dark:text-foreground/82">
                Sign in to your Ubik workspace and continue managing your perishable trade operations.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground/70">RFQ-to-quote workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground/70">PO extraction & ERP handoff</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground/70">Margin visibility & alerts</span>
                </div>
              </div>
            </div>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Work email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@company.com"
                        aria-invalid={!!emailError}
                        className="pe-10"
                      />
                      {emailError && (
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-destructive"
                          aria-hidden
                        >n</span>
                      )}
                    </div>
                    {emailError ? (
                      <p className="text-sm text-destructive animate-fade-in"> {emailError}</p>
                    ) : null}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        aria-invalid={!!passwordError}
                        className="pe-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >n                        {showPassword ? <EyeSlash weight="bold" /> : <Eye weight="bold" />}
                      </button>
                    </div>
                    {passwordError ? (
                      <p className="text-sm text-destructive animate-fade-in"> {passwordError}</p>
                    ) : null}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-ring"
                      />
                      <span className="text-foreground/70">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                      onClick={(event) => {
                        event.preventDefault();
                        toast.info("Password reset link sent to your email");
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-foreground/50">or continue with</span>
                    <div className="flex-1 border-t border-border" />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <a
                      href="/"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 dark:border-gray-700">
                        <Eye weight="bold" />
                        <span className="text-sm text-foreground/70"> Email</span>
                      </div>
                    </a>
                    <a
                      href="/"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 dark:border-gray-700">
                        <ArrowRightIcon weight="bold" />
                        <span className="text-sm text-foreground/70"> Google</span>
                      </div>
                    </a>
                    <a
                      href="/"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 bg-blue-600 rounded-full p-1 border border-blue-600 dark:border-blue-600">
                          <div className="h-4 w-4 rounded-full bg-white" />
                          <span className="text-sm text-white">Sign in with Microsoft</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  
                  <Button type="submit" size="lg" disabled={isSubmitting} className="relative">
                    {isSubmitting ? (
                      <DotmCircular5 size={18} dotSize={3} aria-label="Submitting" />
                    ) : (
                      <CheckCircleIcon data-icon="inline-start" />
                    )}
                    <span className={isSubmitting ? "opacity-0" : ""}n                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
                
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-foreground/50">or continue with</span>
                  <div className="flex-1 border-t border-border" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageShell>
  );
}

// Add animation to the form elements
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';
    setTimeout(() => {
      form.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      form.style.opacity = '1';
      form.style.transform = 'translateY(0)';
    }, 10);
  }
});