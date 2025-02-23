import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContextMenuFolderComponent } from "./context-menu-folder.component";

describe("ContextMenuFolderComponent", () => {
    let component: ContextMenuFolderComponent;
    let fixture: ComponentFixture<ContextMenuFolderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContextMenuFolderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ContextMenuFolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
