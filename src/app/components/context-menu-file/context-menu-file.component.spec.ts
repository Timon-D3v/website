import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContextMenuFileComponent } from "./context-menu-file.component";

describe("ContextMenuFileComponent", () => {
    let component: ContextMenuFileComponent;
    let fixture: ComponentFixture<ContextMenuFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContextMenuFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ContextMenuFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
