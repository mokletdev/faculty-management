"use client";

import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@bprogress/next/app";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
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
  );
};

export default Providers;
