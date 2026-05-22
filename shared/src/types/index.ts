export interface MicroApp {
  name: string;
  port: string;
  status: "online" | "offline";
}

export interface ThemeEvent {
  theme: "light" | "dark";
}

export type EventCallback = (data: unknown) => void;