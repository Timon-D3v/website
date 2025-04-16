import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CmdWindowComponent } from "./cmd-window.component";

describe("CmdWindowComponent", () => {
    let component: CmdWindowComponent;
    let fixture: ComponentFixture<CmdWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CmdWindowComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CmdWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
