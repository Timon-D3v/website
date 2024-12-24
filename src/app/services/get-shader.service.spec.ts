import { TestBed } from "@angular/core/testing";

import { GetShaderService } from "./get-shader.service";

describe("GetShaderService", () => {
    let service: GetShaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GetShaderService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
