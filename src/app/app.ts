import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {BackgroundService} from './config/background';
import {Footbar} from './components/footbar/footbar';
import {TopbarComponent} from './components/topbar/topbar.component';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';

interface LiquidGlassLayer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram;
    positionBuffer: WebGLBuffer;
    aPosition: number;
    uResolution: WebGLUniformLocation | null;
    uTime: WebGLUniformLocation | null;
}

@Component({
    imports: [Footbar, TopbarComponent, NgIf, RouterOutlet],
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App implements AfterViewInit, OnInit, OnDestroy {
    private readonly glassLayers = new Map<HTMLCanvasElement, LiquidGlassLayer>();
    private frameId: number | null = null;
    private startTime: number = 0;
    private resizeListener?: () => void;

    constructor(
        public bgService: BackgroundService,
        public cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    title = 'myhomeIndex';
    isTargetDomain: boolean = false;

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.syncLiquidGlassLayers();
        this.resizeListener = () => this.resizeAllLiquidGlassCanvases();
        window.addEventListener('resize', this.resizeListener, {passive: true});
        this.frameId = window.requestAnimationFrame(this.renderWebglFrame);
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const currentDomain = window.location.hostname;
        this.isTargetDomain = (currentDomain === 'index.mryan2005.top');
        console.info('currentDomain:', currentDomain);
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        if (this.frameId !== null) {
            window.cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }

        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = undefined;
        }

        this.glassLayers.forEach((layer) => {
            layer.gl.deleteBuffer(layer.positionBuffer);
            layer.gl.deleteProgram(layer.shaderProgram);
        });
        this.glassLayers.clear();
    }

    private syncLiquidGlassLayers(): void {
        const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('canvas.liquidGlass-shader'));

        for (const canvas of canvases) {
            if (!this.glassLayers.has(canvas)) {
                const layer = this.initWebglLayer(canvas);
                if (layer) {
                    this.glassLayers.set(canvas, layer);
                }
            }
        }

        for (const [canvas, layer] of this.glassLayers.entries()) {
            if (!canvas.isConnected) {
                layer.gl.deleteBuffer(layer.positionBuffer);
                layer.gl.deleteProgram(layer.shaderProgram);
                this.glassLayers.delete(canvas);
            }
        }
    }

    private initWebglLayer(canvas: HTMLCanvasElement): LiquidGlassLayer | null {
        const gl = canvas.getContext('webgl', {alpha: true, antialias: true});
        if (!gl) {
            return null;
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;

            void main() {
                v_uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            varying vec2 v_uv;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 5; i++) {
                    value += amplitude * noise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec2 uv = v_uv;
                vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
                vec2 p = (uv - 0.5) * aspect;
                float t = u_time * 0.35;

                float n1 = fbm(uv * 4.5 + vec2(t, -t * 0.7));
                float n2 = fbm(uv * 9.0 - vec2(t * 1.2, t * 0.45));
                float n3 = fbm(uv * 15.0 + vec2(-t * 0.6, t * 0.8));
                float rim = smoothstep(0.7, 0.12, length(p));

                vec3 col = vec3(
                    0.65 + 0.18 * n1 + 0.08 * n3,
                    0.74 + 0.16 * n2,
                    0.88 + 0.2 * (n1 - n2)
                );

                col += vec3(0.14, 0.12, 0.1) * smoothstep(0.52, 1.0, n1) * 0.45;
                col += vec3(0.12) * rim;

                float alpha = 0.34 + 0.28 * rim;
                gl_FragColor = vec4(col, alpha);
            }
        `;

        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        const shaderProgram = this.createProgram(gl, vertexShader, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (!shaderProgram) {
            return null;
        }

        const positionBuffer = gl.createBuffer();
        if (!positionBuffer) {
            gl.deleteProgram(shaderProgram);
            return null;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
        const uResolution = gl.getUniformLocation(shaderProgram, 'u_resolution');
        const uTime = gl.getUniformLocation(shaderProgram, 'u_time');

        return {
            canvas,
            gl,
            shaderProgram,
            positionBuffer,
            aPosition,
            uResolution,
            uTime
        };
    }

    private readonly renderWebglFrame = (timestamp: number): void => {
        this.syncLiquidGlassLayers();

        if (this.startTime === 0) {
            this.startTime = timestamp;
        }
        const elapsed = (timestamp - this.startTime) / 1000;

        for (const layer of this.glassLayers.values()) {
            this.resizeLiquidGlassCanvas(layer);
            this.drawLiquidGlassLayer(layer, elapsed);
        }

        this.frameId = window.requestAnimationFrame(this.renderWebglFrame);
    };

    private drawLiquidGlassLayer(layer: LiquidGlassLayer, elapsed: number): void {
        const {gl, shaderProgram, positionBuffer, aPosition, uResolution, uTime} = layer;

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        if (uResolution) {
            gl.uniform2f(uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        if (uTime) {
            gl.uniform1f(uTime, elapsed);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    private resizeAllLiquidGlassCanvases(): void {
        for (const layer of this.glassLayers.values()) {
            this.resizeLiquidGlassCanvas(layer);
        }
    }

    private resizeLiquidGlassCanvas(layer: LiquidGlassLayer): void {
        const {canvas} = layer;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
        const shader = gl.createShader(type);
        if (!shader) {
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn('WebGL shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const program = gl.createProgram();
        if (!program) {
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn('WebGL program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    processBarButtonClicked(buttonName: string) {
        this.cdr.markForCheck();
    }
}
