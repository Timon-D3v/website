import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PathComponent } from "./path.component";

describe("PathComponent", () => {
    let component: PathComponent;
    let fixture: ComponentFixture<PathComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PathComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PathComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
