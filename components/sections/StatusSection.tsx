import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PHeading, PInlineNotification, PText } from "@porsche-design-system/components-react/ssr";
import type { OllamaPanelStatus } from "@/lib/types";

type StatusSectionProps = {
  status: OllamaPanelStatus;
};

/**
 * Displays the connection status and Ollama version information for a host.
 * @param status - The Ollama panel status containing host information and version
 * @returns The status section component
 */
export function StatusSection({ status }: StatusSectionProps) {
  const statusLabel = status.online ? "Online" : "Offline";
  const statusVariant = status.online ? "success" : "danger";

  return (
    <section aria-labelledby="status-section-title" className="grid gap-fluid-md">
      <div className="grid gap-static-xs">
        <PHeading id="status-section-title" tag="h2" size="2xl" weight="semibold">
          Host status
        </PHeading>
        <PText size="small" color="contrast-medium">
          Connection and version for the selected host.
        </PText>
      </div>

      <div className="grid gap-fluid-md md:grid-cols-2">
        <Card title="Connection" description={status.host}>
          <div className="flex flex-wrap items-center gap-static-sm">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <PText size="small" color="contrast-medium">
              {status.online ? "Host is reachable" : "Host is not reachable"}
            </PText>
          </div>
          {!status.online && status.error ? (
            <PInlineNotification
              className="mt-fluid-sm"
              state="error"
              heading="Host unreachable"
              description={status.error}
              dismissButton={false}
            />
          ) : null}
        </Card>

        <Card title="Ollama version" description="From GET /api/version">
          {status.online && status.version ? (
            <PHeading tag="h3" size="3xl" weight="semibold">
              {status.version}
            </PHeading>
          ) : (
            <PText size="small" color="contrast-medium">
              Version unavailable
            </PText>
          )}
        </Card>
      </div>
    </section>
  );
}
