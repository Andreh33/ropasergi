'use client';
import { useEffect, useRef } from 'react';

/**
 * Fondo animado del hero: un campo de neón líquido que CUBRE todo el fondo —
 * masas de azul eléctrico (#1E63FF) y rojo sangre (#FF1230) que fluyen y se
 * deforman (domain-warped fbm). Los dos colores son campos aditivos
 * independientes (donde se solapan → blanco caliente, nunca morado). Sobre
 * negro absoluto. WebGL, siempre activo, sin dependencias de red.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.05;

  // domain warping → flujo orgánico que llena toda la pantalla
  vec2 wB = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, t * 0.8)));
  vec2 wR = vec2(fbm(p * 1.1 + vec2(3.1, -t)), fbm(p * 1.1 + vec2(1.7, -t * 0.9)));

  float fieldB = fbm(p * 1.8 + wB * 1.7);
  float fieldR = fbm(p * 1.6 + wR * 1.7 + 10.0);

  float b = pow(smoothstep(0.28, 0.86, fieldB), 1.4);
  float r = pow(smoothstep(0.30, 0.88, fieldR), 1.4);

  vec3 cBlue = vec3(0.118, 0.388, 1.000); // #1E63FF
  vec3 cRed  = vec3(1.000, 0.071, 0.188); // #FF1230

  // campos aditivos: nunca se mezclan a morado
  vec3 col = cBlue * b * 1.35 + cRed * r * 1.35;

  // donde azul y rojo coinciden → blanco caliente
  col += vec3(1.0) * pow(b * r, 0.85) * 0.9;

  // negro neutro de base (cubre todo, sin huecos)
  col += vec3(0.020, 0.020, 0.028);

  // grano sutil
  col -= hash(uv * uRes.xy + uTime) * 0.020;

  // viñeta muy suave: oscurece bordes sin dejar de cubrir
  float vig = smoothstep(1.5, 0.25, length(uv - 0.5));
  col *= mix(0.62, 1.05, vig);

  // tone-map
  col = col / (col + vec3(1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = 'attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }';

export function NeonFlow({ className }: { className?: string }) {
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
      raf = requestAnimationFrame(loop);
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
