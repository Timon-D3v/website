import { Component, ComponentRef, inject, OnDestroy, OnInit, PLATFORM_ID, viewChild, ViewContainerRef } from "@angular/core";
import { NotificationComponent } from "../notification/notification.component";
import { Notification, NotificationTypes } from "../../../@types/notification.type";
import { NotificationService } from "../../services/notification.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-notifications-wrapper",
    imports: [],
    templateUrl: "./notifications-wrapper.component.html",
    styleUrl: "./notifications-wrapper.component.scss",
})
export class NotificationsWrapperComponent implements OnInit, OnDestroy {
    platformId = inject(PLATFORM_ID);
    viewComponent = viewChild("anchor", {
        read: ViewContainerRef,
    });

    notificationService = inject(NotificationService);
    subscription: Subscription | null = null;

    ngOnInit(): void {
        // Preload a notification
        // Somehow this prevents an error when notifications are called via the notificationService
        this.showWithObjectInput(
            {
                type: "info",
                title: "Info",
                message: "Das ist eine Info",
                closable: true,
            },
            true,
        );

        this.subscription = this.notificationService.notificationObservable.subscribe((notification: Notification): void => {
            this.showWithObjectInput(notification);
        });
    }

    ngOnDestroy(): void {
        if (this.subscription === null) return;

        this.subscription.unsubscribe();
    }

    createComponent(): ComponentRef<NotificationComponent> | undefined {
        const component = NotificationComponent;

        return this.viewComponent()?.createComponent(component);
    }

    destroyComponent(component: ComponentRef<NotificationComponent>): void {
        component.destroy();
    }

    destroyAllComponents(): void {
        this.viewComponent()?.clear();
    }

    show(type: NotificationTypes, title: string, message: string, closable: boolean = true, preloader: boolean = false): void {
        const component = this.createComponent();

        if (typeof component === "undefined" || component === undefined) return console.error("Component is undefined");

        component.setInput("type", type);
        component.setInput("message", message);
        component.setInput("title", title);
        component.setInput("closable", closable);
        component.setInput("preloader", preloader);

        component.instance.closeEvent.subscribe(() => {
            this.destroyComponent(component);
        });

        setTimeout(() => {
            this.destroyComponent(component);
        }, 10000);
    }

    showWithObjectInput(input: Notification, preloader = false): void {
        this.show(input.type, input.title, input.message, input.closable, preloader);
    }
}
