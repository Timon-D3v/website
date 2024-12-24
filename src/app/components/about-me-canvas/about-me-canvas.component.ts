import { isPlatformBrowser } from "@angular/common";
import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GPUComputationRenderer, Variable } from "three/addons/misc/GPUComputationRenderer.js";
import { getElm, on, createElm } from "timonjs";
import PoissonDiskSampling from "poisson-disk-sampling";
import { GetShaderService } from "../../services/get-shader.service";
import { GetAboutMeImageService } from "../../services/get-about-me-image.service";
import { forkJoin } from "rxjs";
import { Point } from "../../../@types/PoissonDiskSamplingPoint.type";

@Component({
    selector: "app-about-me-canvas",
    imports: [],
    templateUrl: "./about-me-canvas.component.html",
    styleUrl: "./about-me-canvas.component.scss",
})
export class AboutMeCanvasComponent implements OnInit {
    platformId = inject(PLATFORM_ID);
    shaderService = inject(GetShaderService);
    imageService = inject(GetAboutMeImageService);

    fragment: string = "";
    vertex: string = "";
    fragmentShaderPosition: string = "";
    fragmentShaderVelocity: string = "";

    COUNT = 128;
    TEXTURE_WIDTH = this.COUNT ** 2;
    POINTS: Point[][] = [];
    POSITIONS = new Float32Array(this.TEXTURE_WIDTH * 3);
    REFERENCE = new Float32Array(this.TEXTURE_WIDTH * 2);
    THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;

    time = 0;

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const imageRequest = this.imageService.getImage("/DiskSampling.jpg");
            const secondaryImageRequest = this.imageService.getImage("/logo_timondev_text.png");
            const fragmentRequest = this.shaderService.getShader("/shader/fragment.glsl");
            const vertexRequest = this.shaderService.getShader("/shader/vertexParticles.glsl");
            const fragmentShaderPositionRequest = this.shaderService.getShader("/shader/fragmentShaderPosition.glsl");
            const fragmentShaderVelocityRequest = this.shaderService.getShader("/shader/fragmentShaderVelocity.glsl");

            forkJoin([imageRequest, secondaryImageRequest, fragmentRequest, vertexRequest, fragmentShaderPositionRequest, fragmentShaderVelocityRequest]).subscribe((res) => {
                this.fragment = res[2];
                this.vertex = res[3];
                this.fragmentShaderPosition = res[4];
                this.fragmentShaderVelocity = res[5];

                this.getAllPoints([res[0], res[1]]).then((result) => {
                    this.POINTS = result;
                    this.initScene();
                });
            });
        }
    }

    initScene(): void {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            canvas: getElm("about-me-scene"),
            antialias: true,
            alpha: true,
        });
        const camera = new THREE.PerspectiveCamera(30, 1 / 1, 0.1, 10);
        const dracoLoader = new DRACOLoader(new THREE.LoadingManager());
        const gltfLoader = new GLTFLoader();
        const gpuCompute = new GPUComputationRenderer(this.COUNT, this.COUNT, renderer);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                uPositions: { value: null },
                resolution: { value: new THREE.Vector4() },
            },
            depthTest: false,
            depthWrite: false,
            transparent: true,
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
        });
        const geometry = new THREE.BufferGeometry();
        const DT_POSITIONS: THREE.DataTexture[] = [];
        const TARGETS: THREE.DataTexture[] = [];
        const DT_VELOCITY = gpuCompute.createTexture();

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false;
        renderer.setClearColor(0x000000, 0.0);
        renderer.setSize(this.getSize(), this.getSize());

        camera.position.set(0, 0, 4);

        dracoLoader.setDecoderPath(`${this.THREE_PATH}/examples/jsm/libs/draco/gltf/`);

        gltfLoader.setDRACOLoader(dracoLoader);

        for (let i = 0; i < this.POINTS.length; i++) {
            DT_POSITIONS.push(gpuCompute.createTexture());
            TARGETS.push(gpuCompute.createTexture());

            this.fillPositionTextureFromPoints(DT_POSITIONS[i], this.POINTS[i]);
            this.fillPositionTextureFromPoints(TARGETS[i], this.POINTS[i]);
        }

        this.fillVelocityTexture(DT_VELOCITY);

        const velocityVariable = gpuCompute.addVariable("textureVelocity", this.fragmentShaderVelocity, DT_VELOCITY);
        const positionVariable = gpuCompute.addVariable("texturePosition", this.fragmentShaderPosition, DT_POSITIONS[0]);

        gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
        gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

        const positionUniforms = positionVariable.material.uniforms;
        const velocityUniforms = velocityVariable.material.uniforms;

        positionUniforms["time"] = { value: 0.0 };
        velocityUniforms["time"] = { value: 1.0 };
        velocityUniforms["uTarget"] = { value: TARGETS[0] };
        velocityVariable.wrapS = THREE.RepeatWrapping;
        velocityVariable.wrapT = THREE.RepeatWrapping;
        positionVariable.wrapS = THREE.RepeatWrapping;
        positionVariable.wrapT = THREE.RepeatWrapping;

        gpuCompute.init();

        for (let i = 0; i < this.TEXTURE_WIDTH; i++) {
            this.POSITIONS[i * 3 + 0] = 5 * (Math.random() - 0.5);
            this.POSITIONS[i * 3 + 1] = 5 * (Math.random() - 0.5);
            this.POSITIONS[i * 3 + 2] = 0;

            this.REFERENCE[i * 2 + 0] = (i % this.COUNT) / this.COUNT;
            this.REFERENCE[i * 2 + 1] = ~~(i / this.COUNT) / this.COUNT;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(this.POSITIONS, 3));
        geometry.setAttribute("reference", new THREE.BufferAttribute(this.REFERENCE, 2));

        const plane = new THREE.Points(geometry, material);

        scene.add(plane);

        // Render the scene
        this.render(gpuCompute, positionVariable, positionUniforms, velocityUniforms, material, scene, camera, renderer);

        // Event Listeners
        let activeElement = 0;
        on(document, "click", () => {
            activeElement === this.POINTS.length - 1 ? 0 : activeElement++;

            velocityUniforms["uTarget"] = { value: TARGETS[activeElement] };
        });

        on(window, "resize", () => {
            renderer.setSize(this.getSize(), this.getSize());
            camera.updateProjectionMatrix();
        });

        on(renderer.domElement, "mouseover", () => {
            activeElement = 1;

            velocityUniforms["uTarget"] = { value: TARGETS[activeElement] };
        });

        on(renderer.domElement, "mouseout", () => {
            activeElement = 0;

            velocityUniforms["uTarget"] = { value: TARGETS[activeElement] };
        });
    }

    getAllPoints(rawImages: Blob[]): Promise<Point[][]> {
        const results: Promise<number[][]>[] = [];

        rawImages.forEach((rawImage) => {
            const image = new Image();
            image.src = URL.createObjectURL(rawImage);

            const canvas = createElm("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = this.COUNT;
            canvas.height = this.COUNT;

            const processImage: Promise<Point[]> = new Promise((resolve, reject) => {
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, this.COUNT, this.COUNT);

                    const data: ImageData = ctx.getImageData(0, 0, this.COUNT, this.COUNT);

                    const points = this.getPoints(data);

                    URL.revokeObjectURL(image.src);

                    resolve(points);
                };
                image.onerror = () => {
                    reject("Error loading image");
                };
            });

            results.push(processImage);
        });

        // Return all processed data when ready
        return Promise.all(results);
    }

    getPoints(data: ImageData): Point[] {
        // 2d-Array
        const array = new Array(this.COUNT).fill(undefined).map(() => new Array(this.COUNT).fill(0));

        for (let i = 0; i < this.COUNT; i++) {
            for (let j = 0; j < this.COUNT; j++) {
                const position = (i + j * this.COUNT) * 4;
                array[i][j] = data.data[position] / 255;
            }
        }

        const pds = new PoissonDiskSampling({
            shape: [1, 1],
            minDistance: 1 / 400,
            maxDistance: 4 / 400,
            tries: 20,
            distanceFunction: (point) => {
                const indexX = Math.floor(point[0] * this.COUNT);
                const indexY = Math.floor(point[1] * this.COUNT);
                return array[indexX][indexY];
            },
            bias: 0,
        });

        let points = pds.fill();

        points.sort(() => Math.random() - 0.5);

        points = points.slice(0, this.TEXTURE_WIDTH);

        points = points.map((point) => {
            let indexX = Math.floor(point[0] * this.COUNT);
            let indexY = Math.floor(point[1] * this.COUNT);
            return [point[0], point[1], array[indexX][indexY]];
        });

        return points;
    }

    getSize(): number {
        return window.innerHeight - 80 > window.innerWidth ? window.innerWidth : window.innerHeight - 80;
    }

    fillPositionTextureFromPoints(texture: THREE.DataTexture, points: Point[]) {
        const array = texture.image.data;

        for (let i = 0, j = 0; i < array.length && j < points.length; i += 4, j += 1) {
            array[i + 0] = 2 * (points[j][0] - 0.5);
            array[i + 1] = -2 * (points[j][1] - 0.5);
            array[i + 2] = 0;
            array[i + 3] = points[j][2];
        }
    }

    fillVelocityTexture(texture: THREE.DataTexture) {
        const array = texture.image.data;

        for (let i = 0; i < array.length; i += 4) {
            array[i + 0] = 0.01 * (Math.random() - 0.5);
            array[i + 1] = 0.01 * (Math.random() - 0.5);
            array[i + 2] = 0;
            array[i + 3] = 1;
        }
    }

    render(gpuCompute: GPUComputationRenderer, positionVariable: Variable, positionUniforms: any, velocityUniforms: any, material: THREE.ShaderMaterial, scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.time += 0.05;

        gpuCompute.compute();
        positionUniforms["time"].value = this.time;
        velocityUniforms["time"].value = this.time;

        const { texture } = gpuCompute.getCurrentRenderTarget(positionVariable);

        material.uniforms["uPositions"].value = texture;
        material.uniforms["time"].value = this.time;

        requestAnimationFrame(() => this.render(gpuCompute, positionVariable, positionUniforms, velocityUniforms, material, scene, camera, renderer));

        renderer.render(scene, camera);
    }
}
