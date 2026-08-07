import { Badge } from "@/components/ui/Badge";
import { PText } from "@porsche-design-system/components-react/ssr";
import { DEFAULT_HOST_URL } from "@/lib/hosts";

type HeroSectionProps = {
  activeHost: string;
};

/**
 * Hero section displaying the Ollama Panel title and description.
 * @param activeHost - The currently active Ollama host URL
 * @returns The hero section component
 */
export function HeroSection({ activeHost }: HeroSectionProps) {
  const isDefaultHost = activeHost === DEFAULT_HOST_URL;

  return (
    <section aria-labelledby="hero-title" className="grid gap-fluid-sm">
      <PText size="medium" color="contrast-medium" className="max-w-3xl">
        Monitor Ollama host health, version, installed models, and running models
        from one simple dashboard.
      </PText>
      <div className="flex flex-wrap items-center gap-static-sm">
        <Badge variant="accent">Selected host</Badge>
        {isDefaultHost ? <Badge variant="neutral">Default</Badge> : null}
        <code className="rounded-md bg-frosted-soft px-static-sm py-static-xs text-small">
          {activeHost}
        </code>
      </div>
    </section>
  );
}
