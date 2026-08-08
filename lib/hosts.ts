import type { OllamaHost } from "./types";

export const OLLAMA_DEFAULT_PORT = 11434;

export const DEFAULT_HOST_URL = `http://localhost:${OLLAMA_DEFAULT_PORT}`;

export const DEFAULT_HOST: OllamaHost = {
  id: "default",
  name: "Local",
  url: DEFAULT_HOST_URL,
  isDefault: true,
};

export const HOSTS_STORAGE_KEY = "ollama-panel-hosts";
export const ACTIVE_HOST_STORAGE_KEY = "ollama-panel-active-host";

/**
 * Creates a unique host id that works outside secure contexts.
 * `crypto.randomUUID()` is missing on plain-http LAN origins (e.g. http://192.168.x.x).
 */
export function createHostId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `host-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
