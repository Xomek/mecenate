import { Platform } from "react-native";

type WebSocketEvent = {
  type: "ping" | "like_updated" | "comment_added";
  postId?: string;
  likesCount?: number;
  comment?: any;
};

type Listener = (event: WebSocketEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Listener[] = [];
  private reconnectTimer: any | null = null;
  private token: string = "";
  private enabled: boolean = true;

  connect(token: string) {
    this.token = token;

    if (Platform.OS === "web") {
      console.log("🌐 WebSocket отключен для веб-версии (CORS)");
      this.enabled = false;
      return;
    }

    if (!this.enabled) return;
    if (this.ws?.readyState === WebSocket.OPEN) return;
    if (this.ws?.readyState === WebSocket.CONNECTING) return;

    try {
      const wsUrl = `wss://k8s.mectest.ru/test-app/ws?token=${token}`;
      console.log("🔌 Подключение к WebSocket...");

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ WebSocket подключен");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ping") return;

          this.listeners.forEach((listener) => listener(data));
        } catch (error) {
          console.error("Ошибка парсинга WebSocket:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`🔌 WebSocket закрыт: ${event.code}`);
        this.ws = null;
        this.reconnect();
      };

      this.ws.onerror = () => {};
    } catch (error) {
      this.reconnect();
    }
  }

  private reconnect() {
    if (Platform.OS === "web") return;
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.token) {
        this.connect(this.token);
      }
    }, 5000);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
    this.listeners = [];
  }

  simulateLikeUpdate(postId: string, likesCount: number) {
    const event: WebSocketEvent = {
      type: "like_updated",
      postId,
      likesCount,
    };
    this.listeners.forEach((listener) => listener(event));
  }

  simulateCommentAdded(comment: any) {
    const event: WebSocketEvent = {
      type: "comment_added",
      comment,
    };
    this.listeners.forEach((listener) => listener(event));
  }
}

export const wsService = new WebSocketService();
