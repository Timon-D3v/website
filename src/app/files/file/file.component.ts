import { Component, input, OnChanges, OnInit, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { ContextMenuFileComponent } from "../../components/context-menu-file/context-menu-file.component";

@Component({
    selector: "app-file",
    imports: [ContextMenuFileComponent],
    templateUrl: "./file.component.html",
    styleUrl: "./file.component.scss",
})
export class FileComponent implements OnInit, OnChanges {
    file = input<MetaData | null>(null);
    pictureUrl = signal("/svg/symbols/template.svg");
    pictureAlt = signal("Unbekannter Dateityp");

    contextX = signal(0);
    contextY = signal(0);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initialize the component by setting the picture.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        this.setPicture();
    }

    /**
     * A lifecycle hook that is called when any data-bound property of a directive changes.
     * This method is called by Angular to indicate that one or more data-bound properties have changed.
     *
     * In this implementation, it triggers the `setPicture` method to update the picture based on the new changes.
     *
     * @returns {void}
     */
    ngOnChanges(): void {
        this.setPicture();
    }

    /**
     * Handles the right-click event on the component.
     *
     * @param {MouseEvent} event - The mouse event triggered by the right-click action.
     * @returns {void}
     *
     * This method prevents the default context menu from appearing and sets the
     * context menu's X and Y coordinates based on the mouse click position.
     */
    rightClick(event: MouseEvent): void {
        event.preventDefault();

        this.contextX.set(event.clientX);
        this.contextY.set(event.clientY);
    }

    /**
     * Sets the picture URL and alt text based on the file type or file extension.
     *
     * - If the file is an image, sets the picture URL to the file's path and the alt text to the original file name.
     * - If the file is a video, sets the picture URL to a video icon and the alt text to "Video".
     * - If the file is an executable, sets the picture URL to an executable icon and the alt text to "Programm".
     * - If the file is a PDF, sets the picture URL to a PDF icon and the alt text to "PDF".
     * - If the file is a ZIP archive, sets the picture URL to a ZIP icon and the alt text to "ZIP".
     * - If the file is a text document, sets the picture URL to a document icon and the alt text to "Text".
     * - If the file is a Word document, sets the picture URL to a Word icon and the alt text to "Word".
     * - If the file is an Excel spreadsheet, sets the picture URL to an Excel icon and the alt text to "Excel".
     * - If the file is a PowerPoint presentation, sets the picture URL to a PowerPoint icon and the alt text to "PowerPoint".
     * - If the file is an audio file, sets the picture URL to an audio icon and the alt text to "Musik".
     * - If the file is a JavaScript file, sets the picture URL to a JavaScript icon and the alt text to "JavaScript".
     * - If the file is a CSS file, sets the picture URL to a CSS icon and the alt text to "CSS".
     * - If the file is an HTML file, sets the picture URL to an HTML icon and the alt text to "HTML".
     * - If the file is a JSON file, sets the picture URL to a JSON icon and the alt text to "JSON".
     * - If the file is a TypeScript file, sets the picture URL to a TypeScript icon and the alt text to "TypeScript".
     * - If the file is a SQL file, sets the picture URL to a database icon and the alt text to "Database".
     * - If the file is a Markdown file, sets the picture URL to a Markdown icon and the alt text to "Markdown".
     * - If the file is a Python file, sets the picture URL to a Python icon and the alt text to "Python".
     * - If the file is a Sass or SCSS file, sets the picture URL to a Sass icon and the alt text to "Sass".
     * - If the file is a log file, sets the picture URL to a log icon and the alt text to "Log".
     * - If the file is a code file (e.g., .vscode, .java, .c, .cpp, .cs, .go, .php, .rb, .swift, .sh, .bat, .cmd, .xml, .vbs), sets the picture URL to a VSCode icon and the alt text to "Code".
     * - For any other file types, sets the picture URL to a template icon and the alt text to "Unbekannter Dateityp".
     *
     * @remarks
     * This method assumes that the file object has a `type` property for MIME type and a `fileName` property for the file name.
     *
     * @returns {void}
     */
    setPicture(): void {
        if (this.file() === null) return;

        const file = this.file() as MetaData;

        if (file.type.startsWith("image/")) {
            this.pictureUrl.set("/files/private/file/" + file.fileName);
            this.pictureAlt.set(file.originalName);
        } else if (file.type.startsWith("video/")) {
            this.pictureUrl.set("/svg/symbols/video.svg");
            this.pictureAlt.set("Video");
        } else if (file.fileName.endsWith(".exe")) {
            this.pictureUrl.set("/svg/symbols/exe.svg");
            this.pictureAlt.set("Programm");
        } else if (file.fileName.endsWith(".pdf")) {
            this.pictureUrl.set("/svg/symbols/pdf.svg");
            this.pictureAlt.set("PDF");
        } else if (file.fileName.endsWith(".zip")) {
            this.pictureUrl.set("/svg/symbols/zip.png");
            this.pictureAlt.set("ZIP");
        } else if (file.fileName.endsWith(".txt")) {
            this.pictureUrl.set("/svg/symbols/document.svg");
            this.pictureAlt.set("Text");
        } else if (file.fileName.endsWith(".doc") || file.fileName.endsWith(".docx")) {
            this.pictureUrl.set("/svg/symbols/word.svg");
            this.pictureAlt.set("Word");
        } else if (file.fileName.endsWith(".xls") || file.fileName.endsWith(".xlsx")) {
            this.pictureUrl.set("/svg/symbols/excel.svg");
            this.pictureAlt.set("Excel");
        } else if (file.fileName.endsWith(".ppt") || file.fileName.endsWith(".pptx")) {
            this.pictureUrl.set("/svg/symbols/powerpoint.svg");
            this.pictureAlt.set("PowerPoint");
        } else if (file.fileName.endsWith(".mp3") || file.fileName.endsWith(".wav")) {
            this.pictureUrl.set("/svg/symbols/audio.svg");
            this.pictureAlt.set("Musik");
        } else if (file.fileName.endsWith(".js")) {
            this.pictureUrl.set("/svg/symbols/javascript.svg");
            this.pictureAlt.set("JavaScript");
        } else if (file.fileName.endsWith(".css")) {
            this.pictureUrl.set("/svg/symbols/css.svg");
            this.pictureAlt.set("CSS");
        } else if (file.fileName.endsWith(".html")) {
            this.pictureUrl.set("/svg/symbols/html.svg");
            this.pictureAlt.set("HTML");
        } else if (file.fileName.endsWith(".json")) {
            this.pictureUrl.set("/svg/symbols/json.svg");
            this.pictureAlt.set("JSON");
        } else if (file.fileName.endsWith(".ts")) {
            this.pictureUrl.set("/svg/symbols/typescript.svg");
            this.pictureAlt.set("TypeScript");
        } else if (file.fileName.endsWith(".sql")) {
            this.pictureUrl.set("/svg/symbols/database.svg");
            this.pictureAlt.set("Database");
        } else if (file.fileName.endsWith(".md")) {
            this.pictureUrl.set("/svg/symbols/markdown.svg");
            this.pictureAlt.set("Markdown");
        } else if (file.fileName.endsWith(".py") || file.fileName.endsWith(".pyc") || file.fileName.endsWith(".pyd")) {
            this.pictureUrl.set("/svg/symbols/python.svg");
            this.pictureAlt.set("Python");
        } else if (file.fileName.endsWith(".sass") || file.fileName.endsWith(".scss")) {
            this.pictureUrl.set("/svg/symbols/sass.svg");
            this.pictureAlt.set("Sass");
        } else if (file.fileName.endsWith(".log")) {
            this.pictureUrl.set("/svg/symbols/log.svg");
            this.pictureAlt.set("Log");
        } else if (
            file.fileName.endsWith(".vscode") ||
            file.fileName.endsWith(".java") ||
            file.fileName.endsWith(".c") ||
            file.fileName.endsWith(".cpp") ||
            file.fileName.endsWith(".cs") ||
            file.fileName.endsWith(".go") ||
            file.fileName.endsWith(".php") ||
            file.fileName.endsWith(".rb") ||
            file.fileName.endsWith(".swift") ||
            file.fileName.endsWith(".sh") ||
            file.fileName.endsWith(".bat") ||
            file.fileName.endsWith(".cmd") ||
            file.fileName.endsWith(".xml") ||
            file.fileName.endsWith(".vbs")
        ) {
            this.pictureUrl.set("/svg/symbols/vscode.svg");
            this.pictureAlt.set("Code");
        } else {
            this.pictureUrl.set("/svg/symbols/template.svg");
            this.pictureAlt.set("Unbekannter Dateityp");
        }
    }

    openFile(): void {
        this.contextX.set(0.123);
        this.contextY.set(0.123);
    }
}
