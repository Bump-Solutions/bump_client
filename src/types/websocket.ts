export interface WebSocketOptions {
  queryParams?: Record<string, string>;
  protocols?: string | string[]; // Protocols to be used for the WebSocket connection
  share?: boolean;
  shouldReconnect?: (event: CloseEvent) => boolean;
  reconnectInterval?: number | ((attempt: number) => number);
  reconnectAttempts?: number;
  heartbeat?: boolean | { interval?: number; timeout?: number };
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export interface ConnectionState {
  isConnected: boolean;
  connectionState: "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"; // Current state of the WebSocket connection
  lastMessage?: { event: string; data: any };
  lastError?: Event | CloseEvent;
  retryCount: number;
  isReconnecting: boolean;
  openSince?: number;
}

export interface ConnectionMeta {
  namespace: string;
  roomId: string;
  createdAt: number;
}

export interface WebSocketConnectionType {
  state: ConnectionState;
  meta: ConnectionMeta;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  subscribe(event: string, handler: (data: any) => void): void;
  unsubscribe(event: string, handler: (data: any) => void): void;
}
