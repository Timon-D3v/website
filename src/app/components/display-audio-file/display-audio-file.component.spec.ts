import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayAudioFileComponent } from "./display-audio-file.component";

describe("DisplayAudioFileComponent", () => {
    let component: DisplayAudioFileComponent;
    let fixture: ComponentFixture<DisplayAudioFileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DisplayAudioFileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayAudioFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
