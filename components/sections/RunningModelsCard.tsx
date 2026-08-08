"use client";

import { useEffect, useState } from "react";
import { PText } from "@porsche-design-system/components-react/ssr";
import { Card } from "@/components/ui/Card";
import type { OllamaPanelStatus, OllamaRunningModel } from "@/lib/types";

type RunningModelsCardProps = {
  host: string;
  initialRunning: OllamaRunningModel[];
};

const REFRESH_INTERVAL_MS = 10000;

function RunningModelList({ items }: { items: OllamaRunningModel[] }) {
  if (items.length === 0) {
    return (
      <PText size="small" color="contrast-medium">
        No models are currently running.
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

export function RunningModelsCard({ host, initialRunning }: RunningModelsCardProps) {
  const [running, setRunning] = useState(initialRunning);
  const [activeHost, setActiveHost] = useState(host);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Soft-navigating `?host=` preserves this client component. Reset the snapshot
  // as soon as the host prop changes so we never show another host's models.
  if (host !== activeHost) {
    setActiveHost(host);
    setRunning(initialRunning);
    setLastUpdated(null);
    setIsRefreshing(false);
  }

  useEffect(() => {
    let ignore = false;
    let sequence = 0;

    const refreshRunningModels = async () => {
      const requestId = ++sequence;
      setIsRefreshing(true);

      try {
        const response = await fetch(`/api/ollama/status?host=${encodeURIComponent(host)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as OllamaPanelStatus;
        const nextRunning = Array.isArray(data.running) ? data.running : [];

        if (!ignore && requestId === sequence) {
          setRunning(nextRunning);
          setLastUpdated(new Date());
        }
      } catch {
        // Keep the last good snapshot for this host; do not pretend the refresh succeeded.
      } finally {
        if (!ignore && requestId === sequence) {
          setIsRefreshing(false);
        }
      }
    };

    void refreshRunningModels();

    const intervalId = window.setInterval(() => {
      void refreshRunningModels();
    }, REFRESH_INTERVAL_MS);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [host]);

  return (
    <Card title="Running models" description="From GET /api/ps">
      <div className="flex flex-wrap items-center justify-between gap-static-sm" aria-live="polite">
        <PText size="x-small" color="contrast-medium">
          {isRefreshing ? "Refreshing…" : lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : "Waiting for first update"}
        </PText>
      </div>
      <div className="mt-static-sm">
        <RunningModelList items={running} />
      </div>
    </Card>
  );
}
