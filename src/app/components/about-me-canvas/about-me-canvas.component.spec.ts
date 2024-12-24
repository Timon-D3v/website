import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutMeCanvasComponent } from "./about-me-canvas.component";

describe("AboutMeCanvasComponent", () => {
    let component: AboutMeCanvasComponent;
    let fixture: ComponentFixture<AboutMeCanvasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AboutMeCanvasComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AboutMeCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
