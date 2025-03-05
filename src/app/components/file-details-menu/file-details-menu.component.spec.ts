import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FileDetailsMenuComponent } from "./file-details-menu.component";

describe("FileDetailsMenuComponent", () => {
    let component: FileDetailsMenuComponent;
    let fixture: ComponentFixture<FileDetailsMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileDetailsMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FileDetailsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
