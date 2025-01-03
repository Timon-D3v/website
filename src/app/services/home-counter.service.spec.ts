import { TestBed } from "@angular/core/testing";

import { HomeCounterService } from "./home-counter.service";

describe("HomeCounterService", () => {
    let service: HomeCounterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HomeCounterService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
