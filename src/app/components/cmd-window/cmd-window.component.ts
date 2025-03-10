import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { CmdService } from "../../services/cmd.service";
import { ExecuteResponse } from "../../../@types/execute.type";
import { lastValueFrom } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-cmd-window",
    imports: [],
    templateUrl: "./cmd-window.component.html",
    styleUrl: "./cmd-window.component.scss",
})
export class CmdWindowComponent implements OnInit {
    private cmdService = inject(CmdService);

    finishedCommands = signal<{ cwd: string; command: string; result: ExecuteResponse }[]>([]);
    cwd = signal("");

    private platform_id = inject(PLATFORM_ID);

    ngOnInit(): void {
        this.updateCwd();
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!isPlatformBrowser(this.platform_id)) return;

        if (event.key === "Enter") {
            const input = event.target as HTMLInputElement;

            if (input.value === "") {
                return;
            }

            this.execute(input.value);

            input.value = "";
        }
    }

    execute(command: string): void {
        if (!isPlatformBrowser(this.platform_id)) return;

        const request = this.cmdService.execute(command);

        request.subscribe(async (result: ExecuteResponse): Promise<void> => {
            const cwd = await this.updateCwd();

            this.finishedCommands.update((commands) => {
                commands.push({
                    cwd,
                    command,
                    result,
                });

                return commands;
            });

            setTimeout((): void => this.scrollToBottom(), 100);
        });
    }

    async updateCwd(): Promise<string> {
        const request = this.cmdService.getCurrentWorkingDirectory();

        const result = await lastValueFrom(request);

        this.cwd.set(result.cwd);

        return result.cwd;
    }

    clearWindow(): void {
        this.finishedCommands.set([]);
    }

    scrollToBottom(): void {
        if (!isPlatformBrowser(this.platform_id)) return;

        const element = document.getElementById("cmd_input_label") as HTMLLabelElement;

        element.scrollTop = element.scrollHeight;

        document.getElementById("cmd_input")?.focus();
    }
}
