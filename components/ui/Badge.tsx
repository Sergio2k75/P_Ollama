import { PTag } from "@porsche-design-system/components-react/ssr";
import type { ReactNode } from "react";
import type { TagVariant } from "@porsche-design-system/components-react/ssr";

type BadgeVariant = "success" | "danger" | "neutral" | "accent";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

/**
 * Maps Badge variants to Porsche Design System tag variants.
 */
const variantMap: Record<BadgeVariant, TagVariant> = {
  success: "success",
  danger: "error",
  neutral: "secondary",
  accent: "primary",
};

/**
 * A Badge component that displays a labeled tag with a specified variant.
 * @param children - The text or content to display in the badge
 * @param variant - The badge style variant (success, danger, neutral, or accent)
 * @returns A styled badge component
 */
export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return <PTag variant={variantMap[variant]}>{children}</PTag>;
}
