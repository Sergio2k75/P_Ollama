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
