import { Suspense } from "react";
import { HostManager } from "@/components/HostManager";
import { HeroSection } from "@/components/sections/HeroSection";
import { ModelsSection } from "@/components/sections/ModelsSection";
import { StatusSection } from "@/components/sections/StatusSection";
import { Card } from "@/components/ui/Card";
import { APP_VERSION } from "@/lib/app-version";
import { DEFAULT_HOST_URL } from "@/lib/hosts";
import { fetchOllamaStatus, validateHostUrl } from "@/lib/ollama";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";

type PageProps = {
  searchParams: Promise<{ host?: string }>;
};

function HostDataFallback() {
  return (
    <div className="grid gap-fluid-lg" aria-busy="true" aria-live="polite">
      <section className="grid gap-fluid-md">
        <div className="grid gap-static-xs">
          <PHeading tag="h2" size="2xl" weight="semibold">
            Host status
          </PHeading>
          <PText size="small" color="contrast-medium">
            Loading connection details for the selected host…
          </PText>
        </div>
        <Card title="Connection" description="Fetching host status">
          <PText size="small" color="contrast-medium">
            Checking reachability…
          </PText>
        </Card>
      </section>
      <section className="grid gap-fluid-md">
        <div className="grid gap-static-xs">
          <PHeading tag="h2" size="2xl" weight="semibold">
            Models
          </PHeading>
          <PText size="small" color="contrast-medium">
            Loading models for the selected host…
          </PText>
        </div>
      </section>
    </div>
  );
}

async function HostStatusPanels({ activeHost }: { activeHost: string }) {
  const status = await fetchOllamaStatus(activeHost);

  return (
    <>
      <StatusSection status={status} />
      <ModelsSection status={status} />
    </>
  );
}

/**
 * Home page displaying Ollama panel dashboard with host selection and status.
 * @param searchParams - URL search parameters containing optional host parameter
 * @returns The main page component
 */
export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const hostParam = params.host ?? DEFAULT_HOST_URL;
  const activeHost = validateHostUrl(hostParam) ?? DEFAULT_HOST_URL;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-contrast-low bg-surface">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-fluid-md py-static-md">
          <PHeading tag="h1" size="medium" weight="semibold">
            Ollama Panel
          </PHeading>
          <PText size="x-small" color="contrast-medium">
            version {APP_VERSION}
          </PText>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1120px] gap-fluid-lg px-fluid-md py-fluid-lg">
        <HeroSection />
        <HostManager activeHost={activeHost} />
        <Suspense key={activeHost} fallback={<HostDataFallback />}>
          <HostStatusPanels activeHost={activeHost} />
        </Suspense>
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
