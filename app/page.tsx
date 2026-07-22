import { HostManager } from "@/components/HostManager";
import { HeroSection } from "@/components/sections/HeroSection";
import { ModelsSection } from "@/components/sections/ModelsSection";
import { StatusSection } from "@/components/sections/StatusSection";
import { DEFAULT_HOST_URL } from "@/lib/hosts";
import { fetchOllamaStatus, validateHostUrl } from "@/lib/ollama";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";

type PageProps = {
  searchParams: Promise<{ host?: string }>;
};

/**
 * Home page displaying Ollama panel dashboard with host selection and status.
 * @param searchParams - URL search parameters containing optional host parameter
 * @returns The main page component
 */
export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const hostParam = params.host ?? DEFAULT_HOST_URL;
  const activeHost = validateHostUrl(hostParam) ?? DEFAULT_HOST_URL;
  const status = await fetchOllamaStatus(activeHost);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-contrast-low bg-surface">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-fluid-md py-static-md">
          <PHeading tag="h1" size="medium" weight="semibold">
            Ollama Panel
          </PHeading>
          <PText size="x-small" color="contrast-medium">
            version 0.06
          </PText>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1120px] gap-fluid-lg px-fluid-md py-fluid-lg">
        <HeroSection activeHost={activeHost} />
        <HostManager activeHost={activeHost} />
        <StatusSection status={status} />
        <ModelsSection status={status} />
      </main>

      <footer className="border-t border-contrast-low bg-surface">
        <div className="mx-auto max-w-[1120px] px-fluid-md py-static-lg">
          <PText size="small" color="contrast-medium">
            Built for local and LAN Ollama monitoring. Use IPs or hostnames when Ollama
            listens on the network; host calls go through the Next.js API route.
          </PText>
        </div>
      </footer>
    </div>
  );
}
