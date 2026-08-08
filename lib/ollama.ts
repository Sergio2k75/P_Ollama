import { OLLAMA_DEFAULT_PORT } from "./hosts";
import type {
  OllamaModel,
  OllamaPanelStatus,
  OllamaRunningModel,
} from "./types";

const FETCH_TIMEOUT_MS = 5000;

const HTTP_SCHEME_PATTERN = /^https?:\/\//i;

/**
 * True when the candidate URL string includes an explicit numeric port.
 * Needed because `URL.port` is "" for protocol defaults (http:80, https:443)
 * even when the input was `host:80` / `host:443`.
 */
function hasExplicitPort(candidate: string): boolean {
  return /^https?:\/\/(?:\[[^\]]+\]|[^[/:?#]+):\d+(?:[/?#]|$)/i.test(candidate);
}

/**
 * Normalizes shorthand host input (IP, hostname, or full URL) to an Ollama base URL.
 * Prepends http:// when missing; defaults port to Ollama's 11434 when omitted.
 * Explicit ports are preserved, including http:80 and https:443.
 * @param raw - User-entered host string
 * @returns Normalized origin (including explicit port) or null if invalid
 */
export function normalizeHostInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  let candidate = trimmed;
  if (!HTTP_SCHEME_PATTERN.test(candidate)) {
    candidate = `http://${candidate}`;
  }

  const explicitPort = hasExplicitPort(candidate);

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  if (url.username || url.password) {
    return null;
  }

  if (!url.hostname) {
    return null;
  }

  const path = url.pathname;
  if (path && path !== "/") {
    return null;
  }

  if (url.search || url.hash) {
    return null;
  }

  // Only default to 11434 when the user omitted a port. Do not treat
  // protocol-default ports (80/443) as omitted — URL.port is empty for those.
  if (!explicitPort) {
    url.port = String(OLLAMA_DEFAULT_PORT);
  }

  return url.origin;
}

/**
 * Validates and normalizes a host URL to ensure it uses http or https protocol.
 * @param raw - The raw URL string to validate
 * @returns The normalized URL origin if valid, or null if invalid
 */
export function validateHostUrl(raw: string): string | null {
  return normalizeHostInput(raw);
}

/**
 * Fetches and parses JSON from a URL with timeout protection.
 * @param url - The URL to fetch from
 * @returns The parsed JSON response or null if the request fails
 */
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type VersionResponse = { version?: string };
type TagsResponse = { models?: OllamaModel[] };
type PsResponse = { models?: OllamaRunningModel[] };
type RecommendationsResponse = {
  recommendations?: Array<{
    model: string;
    description?: string;
    context_length?: number;
    max_output_tokens?: number;
    required_plan?: string;
    vram_bytes?: number;
  }>;
};

/**
 * Fetches the status of an Ollama host including version, available models, and running models.
 * @param hostInput - The host URL to query
 * @returns The Ollama panel status with host information, connectivity, and model data
 */
export async function fetchOllamaStatus(hostInput: string): Promise<OllamaPanelStatus> {
  const host = validateHostUrl(hostInput);

  if (!host) {
    return {
      host: hostInput,
      online: false,
      models: [],
      running: [],
      error:
        "Invalid host. Enter an IP, hostname, or URL (http/https only; port defaults to 11434).",
    };
  }

  const versionData = await fetchJson<VersionResponse>(`${host}/api/version`);

  if (!versionData?.version) {
    return {
      host,
      online: false,
      models: [],
      running: [],
      error: "This Ollama host is not reachable. Check that Ollama is running and the host URL is correct.",
    };
  }

  const [tagsData, psData, recommendationsData] = await Promise.all([
    fetchJson<TagsResponse>(`${host}/api/tags`),
    fetchJson<PsResponse>(`${host}/api/ps`),
    fetchJson<RecommendationsResponse>(`${host}/api/experimental/model-recommendations`),
  ]);

  return {
    host,
    online: true,
    version: versionData.version,
    models: Array.isArray(tagsData?.models) ? tagsData.models : [],
    running: Array.isArray(psData?.models) ? psData.models : [],
    recommendations: Array.isArray(recommendationsData?.recommendations)
      ? recommendationsData.recommendations
      : [],
  };
}
