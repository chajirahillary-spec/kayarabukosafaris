import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-gold">
        EXPLORE. CONSERVE. EMPOWER.
      </p>
      <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl text-green sm:text-6xl">
        Page Not Found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-charcoal/80">
        The page you are looking for is not here. Return to our main page to explore Kenya&apos;s cultures, communities and conservation stories.
      </p>
      <div className="mt-8">
        <LinkButton href="/">Return to KayArabuko</LinkButton>
      </div>
    </Container>
  );
}
