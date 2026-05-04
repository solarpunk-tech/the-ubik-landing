import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { DotmTriangle2 } from "@/components/ui/dotm-triangle-2";

const Index = lazy(() => import("@/pages/Index"));
const Try = lazy(() => import("@/pages/Try"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const SecurityMemo = lazy(() => import("@/pages/SecurityMemo"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Blog = lazy(() => import("@/pages/Blog"));
const Pricing = lazy(() => import("@/pages/Pricing"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="grid min-h-dvh place-items-center bg-background text-foreground">
            <DotmTriangle2 size={42} dotSize={5} aria-label="Loading page" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/try" element={<Try />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/privacy-policy.html" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/terms-of-service.html" element={<Terms />} />
          <Route path="/security" element={<SecurityMemo />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </Suspense>
    </>
  );
}
