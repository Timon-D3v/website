import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SocialsIconComponent } from "./socials-icon.component";

describe("SocialsIconComponent", () => {
    let component: SocialsIconComponent;
    let fixture: ComponentFixture<SocialsIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SocialsIconComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SocialsIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
