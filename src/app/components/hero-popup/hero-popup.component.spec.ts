import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeroPopupComponent } from "./hero-popup.component";

describe("HeroPopupComponent", () => {
    let component: HeroPopupComponent;
    let fixture: ComponentFixture<HeroPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroPopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
