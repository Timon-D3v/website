import { TestBed } from "@angular/core/testing";

import { GetAboutMeImageService } from "./get-about-me-image.service";

describe("GetAboutMeImageService", () => {
    let service: GetAboutMeImageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GetAboutMeImageService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
