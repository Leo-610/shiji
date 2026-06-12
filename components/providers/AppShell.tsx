"use client";

import { BootSequence } from "@/components/cyber/BootSequence";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BootSequence />
      {children}
    </>
  );
}
