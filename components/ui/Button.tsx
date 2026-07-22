"use client";

import { PButton } from "@porsche-design-system/components-react/ssr";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

/**
 * A customizable Button component with variant styling and accessibility support.
 * @param children - The button text or content
 * @param variant - The button style variant (primary, secondary, or danger)
 * @param className - Additional CSS classes to apply
 * @param type - The button type (button, submit, or reset)
 * @param props - Additional button properties (id, disabled, onClick, aria-label)
 * @returns A styled button component
 */
export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const pdsVariant = variant === "danger" ? "secondary" : variant;

  return (
    <PButton
      type={type}
      variant={pdsVariant}
      className={className}
      {...props}
    >
      {children}
    </PButton>
  );
}
