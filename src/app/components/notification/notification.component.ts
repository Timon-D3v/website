import { Component, input, InputSignal, OnInit, output, signal } from "@angular/core";
import { NotificationTypes } from "../../../@types/notification.type";

@Component({
    selector: "app-notification",
    imports: [],
    templateUrl: "./notification.component.html",
    styleUrl: "./notification.component.scss",
})
export class NotificationComponent implements OnInit {
    type = input<NotificationTypes>("neutral");
    message = input("Das ist eine Nachricht");
    title = input("Nachricht:");
    closable = input(true);
    preloader = input(false);

    iconSrc = signal("/svg/neutral.svg");
    iconAlt = signal("Neutrale Benachrichtigung Icon");

    closeEvent = output<void>();

    modes = {
        neutral: {
            iconSrc: "/svg/neutral.svg",
            iconAlt: "Neutrale Benachrichtigung Icon",
        },
        success: {
            iconSrc: "/svg/success.svg",
            iconAlt: "Erfolgreiche Benachrichtigung Icon",
        },
        error: {
            iconSrc: "/svg/error.svg",
            iconAlt: "Fehlerhafte Benachrichtigung Icon",
        },
        warn: {
            iconSrc: "/svg/warn.svg",
            iconAlt: "Warnende Benachrichtigung Icon",
        },
        info: {
            iconSrc: "/svg/info.svg",
            iconAlt: "Informative Benachrichtigung Icon",
        },
    };

    ngOnInit(): void {
        switch (this.type()) {
            case "neutral":
                this.iconSrc.set(this.modes.neutral.iconSrc);
                this.iconAlt.set(this.modes.neutral.iconAlt);
                break;
            case "success":
                this.iconSrc.set(this.modes.success.iconSrc);
                this.iconAlt.set(this.modes.success.iconAlt);
                break;
            case "error":
                this.iconSrc.set(this.modes.error.iconSrc);
                this.iconAlt.set(this.modes.error.iconAlt);
                break;
            case "warn":
                this.iconSrc.set(this.modes.warn.iconSrc);
                this.iconAlt.set(this.modes.warn.iconAlt);
                break;
            case "info":
                this.iconSrc.set(this.modes.info.iconSrc);
                this.iconAlt.set(this.modes.info.iconAlt);
                break;
            default:
                this.iconSrc.set(this.modes.neutral.iconSrc);
                this.iconAlt.set(this.modes.neutral.iconAlt);
                break;
        }
    }

    close(): void {
        this.closeEvent.emit();
    }
}
