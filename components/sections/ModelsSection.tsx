import { Card } from "@/components/ui/Card";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import type { OllamaPanelStatus } from "@/lib/types";

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
    </section>
  );
}
