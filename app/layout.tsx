import type { Metadata } from "next";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react/ssr";
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from "@porsche-design-system/components-react/partials";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ollama Panel",
  description: "Local-first dashboard for monitoring Ollama hosts",
};

/**
 * Root layout component providing Porsche Design System styling and metadata.
 * @param children - Child components to render
 * @returns The root layout wrapper
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scheme-light">
      <head>
        {getFontLinks({ format: "jsx" })}
        {getIconLinks({ format: "jsx" })}
        {getComponentChunkLinks({ format: "jsx" })}
        {getMetaTagsAndIconLinks({ appTitle: "Ollama Panel", format: "jsx" })}
      </head>
      <body className="min-h-screen bg-canvas text-primary antialiased">
        <PorscheDesignSystemProvider>{children}</PorscheDesignSystemProvider>
      </body>
    </html>
  );
}
