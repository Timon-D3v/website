import { TestBed } from "@angular/core/testing";

import { ApiManagementService } from "./api-management.service";

describe("ApiManagementService", () => {
    let service: ApiManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ApiManagementService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
