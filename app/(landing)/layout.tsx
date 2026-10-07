import type { ReactNode } from "react";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LoadingScreen } from "@/components/landing/LoadingScreen";

export default function LandingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <LoadingScreen />

      <LandingNavbar />

      <main className="min-h-screen">
        {children}
      </main>

      <LandingFooter />
    </>
  );
}