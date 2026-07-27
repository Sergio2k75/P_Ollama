import { Card } from "@/components/ui/Card";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import type { OllamaModelRecommendation, OllamaPanelStatus } from "@/lib/types";

type ModelsSectionProps = {
  status: OllamaPanelStatus;
};

/**
 * Displays a list of models with optional empty state message.
 * @param items - Array of items with names to display
 * @param emptyMessage - Message to show when the list is empty
 * @returns A list component or empty state message
 */
function ModelList({
  items,
  emptyMessage,
}: {
  items: { name: string }[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <PText size="small" color="contrast-medium">
        {emptyMessage}
      </PText>
    );
  }

  return (
    <ul className="grid gap-static-sm" role="list">
      {items.map((item, index) => (
        <li
          key={`${item.name}-${index}`}
          className="rounded-md border border-contrast-low bg-frosted-soft px-static-sm py-static-sm break-all text-small"
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

function formatMetricValue(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function formatBytes(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  if (value >= 1024 ** 3) {
    return `${(value / 1024 ** 3).toFixed(1)} GB`;
  }

  if (value >= 1024 ** 2) {
    return `${(value / 1024 ** 2).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${value} B`;
}

function RecommendationTable({ recommendations }: { recommendations: OllamaModelRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <PText size="small" color="contrast-medium">
        No model recommendations are currently available for this host.
      </PText>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-small">
        <thead>
          <tr className="border-b border-contrast-low text-contrast-medium">
            <th className="pb-static-sm pr-static-sm font-semibold">Model</th>
            <th className="pb-static-sm pr-static-sm font-semibold">Description</th>
            <th className="pb-static-sm pr-static-sm font-semibold">Context</th>
            <th className="pb-static-sm pr-static-sm font-semibold">Max output</th>
            <th className="pb-static-sm font-semibold">Plan / VRAM</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((item) => (
            <tr key={item.model} className="border-b border-contrast-low/60 last:border-b-0">
              <td className="py-static-sm pr-static-sm font-semibold">{item.model}</td>
              <td className="py-static-sm pr-static-sm">{item.description ?? "—"}</td>
              <td className="py-static-sm pr-static-sm">
                {item.context_length ? formatMetricValue(item.context_length) : "—"}
              </td>
              <td className="py-static-sm pr-static-sm">
                {item.max_output_tokens ? formatMetricValue(item.max_output_tokens) : "—"}
              </td>
              <td className="py-static-sm">
                {item.required_plan ? item.required_plan : formatBytes(item.vram_bytes)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Displays installed and running models on a host.
 * @param status - The Ollama panel status containing model information
 * @returns The models section component
 */
export function ModelsSection({ status }: ModelsSectionProps) {
  return (
    <section aria-labelledby="models-section-title" className="grid gap-fluid-md">
      <div className="grid gap-static-xs">
        <PHeading id="models-section-title" tag="h2" size="2xl" weight="semibold">
          Models
        </PHeading>
        <PText size="small" color="contrast-medium">
          Installed and currently running models on this host.
        </PText>
      </div>

      <div className="grid gap-fluid-md md:grid-cols-2">
        <Card title="Available models" description="From GET /api/tags">
          <ModelList
            items={status.models}
            emptyMessage="No local models found on this host."
          />
        </Card>

        <Card title="Running models" description="From GET /api/ps">
          <ModelList
            items={status.running}
            emptyMessage="No models are currently running."
          />
        </Card>
      </div>

      <Card title="Model recommendations" description="From GET /api/experimental/model-recommendations">
        <RecommendationTable recommendations={status.recommendations ?? []} />
      </Card>
    </section>
  );
}
