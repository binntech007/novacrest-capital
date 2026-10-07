
"use client";

import { useEffect, useState, type ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

type DashboardShellProps = {
  name: string;
  image: string | null;
  children: ReactNode;
};

export default function DashboardShell({
  name,
  image,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#080d19] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar and mobile drawer */}
        <DashboardSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Main dashboard column */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {/* Header with the user's profile picture */}
          <DashboardHeader
            name={name}
            image={image}
            onMenuClick={() => setMobileOpen(true)}
          />

          {/* Dashboard page content */}
          <main className="w-full min-w-0 flex-1 bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-[1500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
