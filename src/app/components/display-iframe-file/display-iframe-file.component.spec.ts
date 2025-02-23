import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayIframeFileComponent } from "./display-iframe-file.component";

describe("DisplayIframeFileComponent", () => {
    let component: DisplayIframeFileComponent;
    let fixture: ComponentFixture<DisplayIframeFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayIframeFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayIframeFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
