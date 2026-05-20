'use client';
import { useEffect, useRef } from 'react';

/**
 * Fondo animado de líneas de neón fluidas (acid, magenta, cyber, violet) con glow,
 * sobre fondo oscuro. Siempre activo, sin dependencias de red. Reemplaza la "mancha"
 * difusa por algo más definido y vibrante, manteniendo el movimiento de fondo.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 neonLine(vec2 uv, float yBase, float freq, float amp, float speed, float phase, vec3 color, float thick){
  float y = yBase + sin(uv.x * freq + uTime * speed + phase) * amp
                  + sin(uv.x * freq * 2.3 + uTime * speed * 0.6) * amp * 0.35;
  float d = abs(uv.y - y);
  float glow = thick / (d + 0.0008);
  glow = pow(glow, 1.25);
  return color * glow;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 col = vec3(0.0);
  col += neonLine(p, 0.34, 2.0, 0.11,  0.55, 0.0, vec3(0.80, 1.00, 0.00), 0.0055); // acid
  col += neonLine(p, 0.52, 1.6, 0.14, -0.45, 2.0, vec3(1.00, 0.12, 0.42), 0.0050); // magenta
  col += neonLine(p, 0.66, 2.6, 0.09,  0.80, 4.0, vec3(0.00, 0.90, 1.00), 0.0040); // cyber
  col += neonLine(p, 0.44, 1.3, 0.17,  0.38, 1.0, vec3(0.55, 0.36, 0.97), 0.0050); // violet

  // fondo grafito-morado
  vec3 bg = vec3(0.086, 0.075, 0.122);
  col += bg;

  // grano sutil
  col -= hash(uv * uRes.xy + uTime) * 0.02;

  // viñeta para integrar con el resto de la página
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= mix(0.55, 1.0, vig);

  // tone-map para que los glows no quemen
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
