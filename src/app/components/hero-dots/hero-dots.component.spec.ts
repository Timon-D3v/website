import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeroDotsComponent } from "./hero-dots.component";

describe("HeroDotsComponent", () => {
    let component: HeroDotsComponent;
    let fixture: ComponentFixture<HeroDotsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroDotsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroDotsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
