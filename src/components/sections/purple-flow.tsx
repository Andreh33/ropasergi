'use client';
import { useEffect, useRef } from 'react';

/**
 * Fondo de "vídeo" morado generativo (humo/flujo) con WebGL.
 * Se reproduce SIEMPRE, sin condiciones ni dependencias de red: es ideal como
 * fondo de vídeo robusto. Si en su lugar quieres un .mp4, mete el archivo en
 * /public/video y úsalo con <video autoPlay muted loop playsInline>.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

// fbm noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<6;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * 3.0;
  float t = uTime * 0.06;
  // flujo
  vec2 q = vec2(fbm(p + vec2(t, -t)), fbm(p + vec2(-t*0.7, t*0.5)));
  float n = fbm(p + q*1.8 + vec2(t*0.4, t*0.2));

  // paleta morada
  vec3 deep   = vec3(0.086, 0.075, 0.122);   // #16131f
  vec3 violet = vec3(0.42, 0.18, 0.78);       // morado
  vec3 glow   = vec3(0.72, 0.58, 0.96);       // morado claro
  vec3 col = mix(deep, violet, smoothstep(0.25, 0.75, n));
  col = mix(col, glow, smoothstep(0.65, 0.95, n) * 0.55);

  // viñeta para integrar con el fondo
  float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
  col *= mix(0.35, 1.0, vig);

  // grano sutil
  col -= hash(uv * uRes.xy + uTime) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export function PurpleFlow({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const time = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop); // siempre, sin condiciones
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
