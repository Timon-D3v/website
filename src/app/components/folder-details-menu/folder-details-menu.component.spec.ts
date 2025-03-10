import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FolderDetailsMenuComponent } from "./folder-details-menu.component";

describe("FolderDetailsMenuComponent", () => {
    let component: FolderDetailsMenuComponent;
    let fixture: ComponentFixture<FolderDetailsMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FolderDetailsMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FolderDetailsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
