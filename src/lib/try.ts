export type TryTarget = "stub" | "razorpay" | "app";

export const tryTarget = (import.meta.env.VITE_TRY_TARGET as TryTarget | undefined) ?? "stub";

export async function submitTry(values: { email: string; tier: string }) {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  if (tryTarget === "razorpay") {
    return {
      status: "queued" as const,
      message: `Paid access is not live yet. ${values.email} is queued for ${values.tier}.`
    };
  }

  if (tryTarget === "app") {
    return {
      status: "queued" as const,
      message: `App handoff is not live yet. ${values.email} is queued for ${values.tier}.`
    };
  }

  return {
    status: "queued" as const,
    message: "We'll reach out within one business day."
  };
}
