import { TestBed } from "@angular/core/testing";

import { SiteTitleService } from "./site-title.service";

describe("SiteTitleService", () => {
    let service: SiteTitleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SiteTitleService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
