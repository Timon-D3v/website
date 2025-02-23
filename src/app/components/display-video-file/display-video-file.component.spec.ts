import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayVideoFileComponent } from "./display-video-file.component";

describe("DisplayVideoFileComponent", () => {
    let component: DisplayVideoFileComponent;
    let fixture: ComponentFixture<DisplayVideoFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayVideoFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayVideoFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
