"use client";

import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@bprogress/next/app";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ProgressProvider
        height="3px"
        color="#0d3882"
        spinnerPosition="top-right"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
        <Toaster />
      </ProgressProvider>
    </SessionProvider>
  );
};

export default Providers;
