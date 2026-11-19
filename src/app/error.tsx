"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";

export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <Container className="py-28 text-center">
      <h1 className="mx-auto max-w-2xl text-5xl text-green sm:text-6xl">
        We couldn&apos;t load this journey.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-charcoal/80">
        Something went wrong on our side. Please try again.
      </p>
      <div className="mt-8">
        <Button onClick={() => retry()}>Try again</Button>
      </div>
    </Container>
  );
}
