import { PText } from "@porsche-design-system/components-react/ssr";

/**
 * Hero section displaying the Ollama Panel title and description.
 * @returns The hero section component
 */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="grid gap-fluid-sm">
      <PText size="medium" color="contrast-medium" className="max-w-3xl">
        Monitor Ollama host health, version, installed models, and running models
        from one simple dashboard.
      </PText>
    </section>
  );
}
