export type OllamaHost = {
  id: string;
  name: string;
  url: string;
  isDefault?: boolean;
};

export type OllamaPanelStatus = {
  host: string;
  online: boolean;
  version?: string;
  models: OllamaModel[];
  running: OllamaRunningModel[];
  error?: string;
};

export type OllamaModel = {
  name: string;
  model?: string;
  modified_at?: string;
  size?: number;
  digest?: string;
};

export type OllamaRunningModel = {
  name: string;
  model?: string;
  size?: number;
  digest?: string;
  expires_at?: string;
};
