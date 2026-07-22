import { Badge } from "@/components/ui/Badge";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";

type HeroSectionProps = {
  activeHost: string;
};

/**
 * Hero section displaying the Ollama Panel title and description.
 * @param activeHost - The currently active Ollama host URL
 * @returns The hero section component
 */
export function HeroSection({ activeHost }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-title" className="grid gap-fluid-sm">
      <PText size="medium" color="contrast-medium" className="max-w-3xl">
        Monitor Ollama host health, version, installed models, and running models
        from one simple dashboard.
      </PText>
      <div className="flex flex-wrap items-center gap-static-sm">
        <Badge variant="neutral">Default host</Badge>
        <code className="rounded-md bg-frosted-soft px-static-sm py-static-xs text-small">
          {activeHost}
        </code>
      </div>
    </section>
  );
}
