import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A Card component for displaying grouped content with a title and optional description.
 * @param title - The card title
 * @param description - Optional subtitle or description text
 * @param children - The card content
 * @param className - Additional CSS classes to apply
 * @returns A styled card component
 */
export function Card({ title, description, children, className = "" }: CardProps) {
  return (
    <article
      className={`rounded-lg border border-contrast-low bg-surface p-fluid-md shadow-medium ${className}`}
    >
      <header className="mb-fluid-sm">
        <PHeading tag="h3" size="lg" weight="semibold">
          {title}
        </PHeading>
        {description ? (
          <PText size="small" color="contrast-medium" className="mt-static-xs">
            {description}
          </PText>
        ) : null}
      </header>
      {children}
    </article>
  );
}
