export type Notification = {
    type: NotificationTypes;
    title: string;
    message: string;
    closable: boolean;
};

export type NotificationTypes = "neutral" | "success" | "error" | "warn" | "info";
