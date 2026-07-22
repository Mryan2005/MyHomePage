import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {BackgroundService} from './config/background';
import {Footbar} from './components/footbar/footbar';
import {TopbarComponent} from './components/topbar/topbar.component';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
    imports: [Footbar, TopbarComponent, NgIf, RouterOutlet],
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('liquidWebglCanvas') liquidWebglCanvas?: ElementRef<HTMLCanvasElement>;

    private gl: WebGLRenderingContext | null = null;
    private shaderProgram: WebGLProgram | null = null;
    private positionBuffer: WebGLBuffer | null = null;
    private frameId: number | null = null;
    private startTime: number = 0;
    private resizeListener?: () => void;
    private uResolution: WebGLUniformLocation | null = null;
    private uTime: WebGLUniformLocation | null = null;
    private aPosition = -1;

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

        this.initWebglLayer();
        this.resizeListener = () => this.resizeWebglCanvas();
        window.addEventListener('resize', this.resizeListener, {passive: true});
        this.frameId = window.requestAnimationFrame(this.renderWebglFrame);
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const currentDomain = window.location.hostname;
        this.isTargetDomain = (currentDomain === 'index.mryan2005.top');
        console.info("currentDomain:",  currentDomain)
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
    }

    private initWebglLayer(): void {
        const canvas = this.liquidWebglCanvas?.nativeElement;
        if (!canvas) {
            return;
        }

        const gl = canvas.getContext('webgl', {alpha: true, antialias: true});
        if (!gl) {
            return;
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;

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
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 p = uv * 2.0 - 1.0;
                p.x *= u_resolution.x / u_resolution.y;
                float t = u_time * 0.16;

                float n1 = fbm(uv * 4.0 + vec2(t, -t * 0.8));
                float n2 = fbm(uv * 8.5 - vec2(t * 1.3, t * 0.45));
                float n3 = fbm(uv * 12.0 + vec2(-t * 0.7, t * 0.9));

                vec3 col = vec3(
                    0.46 + 0.30 * n1 + 0.12 * n3,
                    0.57 + 0.26 * n2,
                    0.74 + 0.24 * (n1 - n2)
                );

                float bloom = smoothstep(0.55, 1.0, n1);
                col += vec3(0.22, 0.18, 0.15) * bloom * 0.55;

                float vignette = smoothstep(1.25, 0.08, length(p));
                float alpha = 0.28 * vignette;

                gl_FragColor = vec4(col, alpha);
            }
        `;

        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) {
            return;
        }

        const shaderProgram = this.createProgram(gl, vertexShader, fragmentShader);
        if (!shaderProgram) {
            return;
        }

        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.positionBuffer = gl.createBuffer();
        if (!this.positionBuffer) {
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        this.aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
        this.uResolution = gl.getUniformLocation(shaderProgram, 'u_resolution');
        this.uTime = gl.getUniformLocation(shaderProgram, 'u_time');
        this.resizeWebglCanvas();
    }

    private readonly renderWebglFrame = (timestamp: number): void => {
        if (!this.gl || !this.shaderProgram || !this.positionBuffer) {
            return;
        }

        if (this.startTime === 0) {
            this.startTime = timestamp;
        }

        const gl = this.gl;
        const elapsed = (timestamp - this.startTime) / 1000;

        this.resizeWebglCanvas();
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.aPosition);
        gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

        if (this.uResolution) {
            gl.uniform2f(this.uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        if (this.uTime) {
            gl.uniform1f(this.uTime, elapsed);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.frameId = window.requestAnimationFrame(this.renderWebglFrame);
    };

    private resizeWebglCanvas(): void {
        const canvas = this.liquidWebglCanvas?.nativeElement;
        const gl = this.gl;
        if (!canvas || !gl) {
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.floor(window.innerWidth * dpr);
        const height = Math.floor(window.innerHeight * dpr);

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
        // this.currentDisplayPart = buttonName;
        this.cdr.markForCheck();
    }
}
