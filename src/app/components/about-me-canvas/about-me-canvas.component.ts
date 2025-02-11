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

    /**
     * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
     * This method is used to perform initialization tasks for the component.
     *
     * In this implementation, it checks if the platform is a browser and then makes multiple asynchronous
     * requests to fetch images and shaders using the `imageService` and `shaderService`. Once all requests
     * are completed, it processes the responses to initialize shaders and points, and then sets up the scene.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

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

    /**
     * Initializes the 3D scene, including setting up the renderer, camera, loaders, GPU computation renderer,
     * materials, geometries, and event listeners. This method configures the scene with various textures,
     * shaders, and attributes, and sets up the rendering loop.
     *
     * @remarks
     * This method uses THREE.js for 3D rendering and GPUComputationRenderer for GPU-based computations.
     * It also sets up event listeners for user interactions such as clicks and mouse events.
     *
     * @returns {void}
     */
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

    /**
     * Processes an array of raw image blobs and extracts points from each image.
     *
     * @param {Blob[]} rawImages - An array of raw image blobs to be processed.
     * @returns {Promise<Point[][]>} A promise that resolves to an array of arrays of points extracted from each image.
     *
     * The function performs the following steps for each image:
     * 1. Creates an HTMLImageElement and sets its source to a URL created from the raw image blob.
     * 2. Creates a canvas element and sets its dimensions.
     * 3. Draws the image onto the canvas when the image has loaded.
     * 4. Extracts image data from the canvas and processes it to get points.
     * 5. Revokes the object URL created for the image.
     * 6. Resolves the promise with the extracted points or rejects it if there is an error loading the image.
     *
     * The function returns a promise that resolves when all images have been processed.
     */
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

    /**
     * Generates an array of points based on the provided image data using Poisson Disk Sampling.
     *
     * @param {ImageData} data - The image data from which points are generated.
     * @returns {Point[]} An array of points, each represented as an array of three numbers [x, y, value],
     * where `x` and `y` are the coordinates of the point and `value` is the normalized value from the image data.
     */
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

    /**
     * Calculates the size for the canvas based on the window dimensions.
     *
     * @returns {number} The size of the canvas, which is the smaller value between
     * the window's inner width and the window's inner height minus 80 pixels.
     */
    getSize(): number {
        return window.innerHeight - 80 > window.innerWidth ? window.innerWidth : window.innerHeight - 80;
    }

    /**
     * Fills a THREE.DataTexture with position data from an array of points.
     *
     * @param {THREE.Data3DTexture} texture - The THREE.DataTexture to be filled.
     * @param {Point[]} points - An array of points, where each point is an array of three numbers [x, y, z].
     *
     * The function maps the x and y coordinates of each point to the range [-1, 1] and assigns them to the texture's data array.
     * The z coordinate is set to 0, and the third value from each point is assigned to the alpha channel of the texture.
     *
     * @returns {void}
     */
    fillPositionTextureFromPoints(texture: THREE.DataTexture, points: Point[]): void {
        const array = texture.image.data;

        for (let i = 0, j = 0; i < array.length && j < points.length; i += 4, j += 1) {
            array[i + 0] = 2 * (points[j][0] - 0.5);
            array[i + 1] = -2 * (points[j][1] - 0.5);
            array[i + 2] = 0;
            array[i + 3] = points[j][2];
        }
    }

    /**
     * Fills the provided velocity texture with random values.
     *
     * @param {THREE.Data3DTexture} texture - A THREE.DataTexture object whose image data will be modified.
     * The texture's image data is expected to be a flat array where each pixel is represented by four consecutive values (RGBA).
     * The red and green channels (array[i] and array[i + 1]) are set to small random values between -0.005 and 0.005,
     * the blue channel (array[i + 2]) is set to 0, and the alpha channel (array[i + 3]) is set to 1.
     *
     * @returns {void}
     */
    fillVelocityTexture(texture: THREE.DataTexture): void {
        const array = texture.image.data;

        for (let i = 0; i < array.length; i += 4) {
            array[i + 0] = 0.01 * (Math.random() - 0.5);
            array[i + 1] = 0.01 * (Math.random() - 0.5);
            array[i + 2] = 0;
            array[i + 3] = 1;
        }
    }

    /**
     * Renders the scene using GPU computation and WebGL rendering.
     *
     * @param {GPUComputationRenderer} gpuCompute - The GPUComputationRenderer instance used for GPU-based calculations.
     * @param {Variable} positionVariable - The variable representing the position in the GPU computation.
     * @param {any} positionUniforms - The uniforms related to position for the shader material.
     * @param {any} velocityUniforms - The uniforms related to velocity for the shader material.
     * @param {THREE.ShaderMaterial} material - The ShaderMaterial used for rendering.
     * @param {THREE.Scene} scene - The Scene to be rendered.
     * @param {THREE.PerspectiveCamera} camera - The PerspectiveCamera used for rendering the scene.
     * @param {THREE.WebGLRenderer} renderer - The WebGLRenderer used to render the scene.
     *
     * This method updates the time uniform for the position and velocity shaders, computes the GPU-based calculations,
     * and updates the position and velocity uniforms for the shader material. It then requests an animation frame
     * to continue the rendering loop.
     *
     * @returns {void}
     *
     * @remarks
     * This method uses requestAnimationFrame to create a loop that continuously updates the scene and renders it.
     * It also updates the time uniform for the shaders to create animations based on time.
     * The method is called recursively to create a continuous rendering loop.
     */
    render(gpuCompute: GPUComputationRenderer, positionVariable: Variable, positionUniforms: any, velocityUniforms: any, material: THREE.ShaderMaterial, scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
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
