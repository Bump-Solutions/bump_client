export interface Notification {
  id: number;
  type: "message" | "general";
  read: boolean;
  title: string;
  message: string;
  date: Date;
}
