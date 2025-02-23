import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayImageFileComponent } from "./display-image-file.component";

describe("DisplayImageFileComponent", () => {
    let component: DisplayImageFileComponent;
    let fixture: ComponentFixture<DisplayImageFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayImageFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayImageFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
