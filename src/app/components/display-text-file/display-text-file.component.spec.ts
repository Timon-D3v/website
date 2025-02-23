import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayTextFileComponent } from "./display-text-file.component";

describe("DisplayTextFileComponent", () => {
    let component: DisplayTextFileComponent;
    let fixture: ComponentFixture<DisplayTextFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayTextFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayTextFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
