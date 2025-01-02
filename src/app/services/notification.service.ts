import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Subject } from "rxjs";
import { Notification } from "../../@types/notification.type";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    notificationSubject = new Subject<Notification>();
    notificationObservable = this.notificationSubject.asObservable();

    error(title: string, message: string, closable: boolean = true) {
        this.notificationSubject.next({
            type: "error",
            title,
            message,
            closable,
        });
    }

    warn(title: string, message: string, closable: boolean = true) {
        this.notificationSubject.next({
            type: "warn",
            title,
            message,
            closable,
        });
    }

    warning(title: string, message: string, closable: boolean = true) {
        this.warn(title, message, closable);
    }

    info(title: string, message: string, closable: boolean = true) {
        this.notificationSubject.next({
            type: "info",
            title,
            message,
            closable,
        });
    }

    success(title: string, message: string, closable: boolean = true) {
        this.notificationSubject.next({
            type: "success",
            title,
            message,
            closable,
        });
    }

    neutral(title: string, message: string, closable: boolean = true) {
        this.notificationSubject.next({
            type: "neutral",
            title,
            message,
            closable,
        });
    }
}
