"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PButton, PHeading, PTag, PText } from "@porsche-design-system/components-react/ssr";
import { Card } from "@/components/ui/Card";
import {
  ACTIVE_HOST_STORAGE_KEY,
  DEFAULT_HOST,
  HOSTS_STORAGE_KEY,
} from "@/lib/hosts";
import { validateHostUrl } from "@/lib/ollama";
import type { OllamaHost } from "@/lib/types";

type HostManagerProps = {
  activeHost: string;
};

/**
 * Loads hosts from localStorage or returns the default host.
 * @returns Array of OllamaHost objects with at least the default host
 */
function loadHosts(): OllamaHost[] {
  if (typeof window === "undefined") {
    return [DEFAULT_HOST];
  }

  try {
    const raw = localStorage.getItem(HOSTS_STORAGE_KEY);
    if (!raw) {
      return [DEFAULT_HOST];
    }
    const parsed = JSON.parse(raw) as OllamaHost[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_HOST];
    }
    const hasDefault = parsed.some((host) => host.isDefault);
    return hasDefault ? parsed : [DEFAULT_HOST, ...parsed];
  } catch {
    return [DEFAULT_HOST];
  }
}

/**
 * Saves hosts to localStorage as a JSON string.
 * @param hosts - Array of hosts to persist
 */
function saveHosts(hosts: OllamaHost[]) {
  localStorage.setItem(HOSTS_STORAGE_KEY, JSON.stringify(hosts));
}

/**
 * Host Manager component for adding, removing, and selecting Ollama hosts.
 * @param activeHost - The currently active Ollama host URL
 * @returns The host manager section component
 */
export function HostManager({ activeHost }: HostManagerProps) {
  const router = useRouter();
  const dialogDescriptionId = useId();
  const addButtonId = useId();

  const [hosts, setHosts] = useState<OllamaHost[]>(() => loadHosts());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const urlInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem(ACTIVE_HOST_STORAGE_KEY, activeHost);
  }, [activeHost]);

  /**
   * Selects a host and navigates to it.
   */
  const selectHost = useCallback(
    (url: string) => {
      localStorage.setItem(ACTIVE_HOST_STORAGE_KEY, url);
      router.push(`/?host=${encodeURIComponent(url)}`);
    },
    [router],
  );

  /**
   * Opens the add host dialog and resets the form.
   */
  const openDialog = () => {
    setFormError(null);
    setUrlValue("");
    setNameValue("");
    setDialogOpen(true);
  };

  /**
   * Closes the add host dialog and returns focus to the add button.
   */
  const closeDialog = () => {
    setDialogOpen(false);
    setFormError(null);
    document.getElementById(addButtonId)?.focus();
  };

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      urlInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogOpen]);
  /**
   * Handles adding a new host after form validation.
   */  const handleAddHost = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedUrl = validateHostUrl(urlValue);

    if (!normalizedUrl) {
      setFormError(
        "Enter an IP, hostname, or URL. http/https only; port defaults to 11434.",
      );
      return;
    }

    if (hosts.some((host) => host.url === normalizedUrl)) {
      setFormError("This host is already in your list");
      return;
    }

    const label =
      nameValue.trim() ||
      new URL(normalizedUrl).hostname ||
      "Ollama host";

    const newHost: OllamaHost = {
      id: crypto.randomUUID(),
      name: label,
      url: normalizedUrl,
    };

    const nextHosts = [...hosts, newHost];
    setHosts(nextHosts);
    saveHosts(nextHosts);
    setDialogOpen(false);
    selectHost(normalizedUrl);
  };

  /**
   * Removes a host from the list and navigates to default host if needed.
   */
  const handleRemoveHost = (host: OllamaHost) => {
    if (host.isDefault) {
      return;
    }

    const nextHosts = hosts.filter((item) => item.id !== host.id);
    setHosts(nextHosts);
    saveHosts(nextHosts);

    if (activeHost === host.url) {
      selectHost(DEFAULT_HOST.url);
    }
  };

  return (
    <section aria-labelledby="host-manager-title">
      <Card
        title="Ollama hosts"
        description="Add, remove, and switch between Ollama hosts. Stored in your browser."
      >
        <h2 id="host-manager-title" className="sr-only">
          Ollama host manager
        </h2>

        <ul className="grid gap-static-sm" role="list" aria-label="Saved Ollama hosts">
          {hosts.map((host) => {
            const isActive = host.url === activeHost;

            return (
              <li
                key={host.id}
                className={`flex flex-wrap items-center gap-static-sm rounded-md border px-static-sm py-static-sm ${
                  isActive
                    ? "border-contrast-medium bg-frosted-soft"
                    : "border-contrast-low bg-surface"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectHost(host.url)}
                  aria-pressed={isActive}
                  aria-label={`Select host ${host.name}, ${host.url}`}
                  className="min-w-0 flex-1 rounded-md text-left"
                >
                  <PText size="small" weight="semibold">
                    {host.name}
                  </PText>
                  <PText size="x-small" color="contrast-medium" ellipsis>
                    {host.url}
                  </PText>
                </button>

                {host.isDefault ? (
                  <PTag variant="secondary">Default</PTag>
                ) : (
                  <PButton
                    type="button"
                    variant="secondary"
                    aria-label={`Remove host ${host.name}`}
                    onClick={() => handleRemoveHost(host)}
                  >
                    Remove
                  </PButton>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-fluid-sm">
          <button
            id={addButtonId}
            type="button"
            onClick={openDialog}
            className="rounded-md bg-contrast-high px-static-sm py-static-xs text-small font-semibold text-surface"
          >
            Add host
          </button>
        </div>
      </Card>

      {dialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-fluid-md py-fluid-md"
          onClick={closeDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-host-title"
            aria-describedby={dialogDescriptionId}
            className="w-full max-w-lg rounded-lg border border-contrast-low bg-surface p-fluid-md shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-fluid-md">
              <div className="grid gap-static-xs">
                <PHeading id="add-host-title" tag="h2" size="xl" weight="semibold">
                  Add Ollama host
                </PHeading>
                <PText id={dialogDescriptionId} size="small" color="contrast-medium">
                  Enter an IP, hostname, or full URL. http and https only; port defaults
                  to 11434 when omitted.
                </PText>
              </div>

              <form className="grid gap-fluid-sm" onSubmit={handleAddHost}>
                <label className="grid gap-static-xs text-small font-semibold" htmlFor="host-url">
                  <span>Host URL</span>
                  <input
                    ref={urlInputRef}
                    id="host-url"
                    name="host-url"
                    type="text"
                    placeholder="192.168.1.10 or http://192.168.1.10:11434"
                    value={urlValue}
                    required
                    aria-invalid={Boolean(formError)}
                    className="rounded-md border border-contrast-low bg-surface px-static-sm py-static-sm"
                    onInput={(event) => {
                      setUrlValue((event.target as HTMLInputElement).value);
                      if (formError) {
                        setFormError(null);
                      }
                    }}
                  />
                </label>

                {formError ? (
                  <p role="alert" className="text-small text-danger">
                    {formError}
                  </p>
                ) : null}

                <label className="grid gap-static-xs text-small font-semibold" htmlFor="host-name">
                  <span>Display name (optional)</span>
                  <input
                    id="host-name"
                    name="host-name"
                    type="text"
                    placeholder="Workstation"
                    value={nameValue}
                    className="rounded-md border border-contrast-low bg-surface px-static-sm py-static-sm"
                    onInput={(event) => {
                      setNameValue((event.target as HTMLInputElement).value);
                    }}
                  />
                </label>

                <div className="flex flex-wrap justify-end gap-static-sm">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-md border border-contrast-low px-static-sm py-static-xs text-small font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-contrast-high px-static-sm py-static-xs text-small font-semibold text-surface"
                  >
                    Save host
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
