import { Component, input, OnChanges, OnInit, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";

@Component({
    selector: "app-file",
    imports: [],
    templateUrl: "./file.component.html",
    styleUrl: "./file.component.scss",
})
export class FileComponent implements OnInit, OnChanges {
    file = input<MetaData | null>(null);
    pictureUrl = signal("/svg/symbols/template.svg");
    pictureAlt = signal("Unbekannter Dateityp");

    ngOnInit(): void {
        this.setPicture();
    }

    ngOnChanges(): void {
        this.setPicture();
    }

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
}
