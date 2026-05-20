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

// línea de luz fina con glow (monocromática)
float lightLine(vec2 p, float yBase, float freq, float amp, float speed, float phase, float thick){
  float y = yBase + sin(p.x * freq + uTime * speed + phase) * amp
                  + sin(p.x * freq * 2.6 + uTime * speed * 0.5) * amp * 0.3;
  float d = abs(p.y - y);
  float glow = thick / (d + 0.0009);
  return pow(glow, 1.35);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // un haz de líneas finas, todas del mismo color (acid), creando un campo de luz
  float light = 0.0;
  light += lightLine(p, 0.40, 1.7, 0.16, 0.42, 0.0, 0.0042);
  light += lightLine(p, 0.50, 1.4, 0.14, -0.34, 1.6, 0.0036);
  light += lightLine(p, 0.58, 2.1, 0.12, 0.55, 3.1, 0.0030);
  light += lightLine(p, 0.46, 1.1, 0.18, 0.28, 4.4, 0.0034);

  // color único: acid (verde neón). Núcleo casi blanco, halo acid.
  vec3 acid = vec3(0.80, 1.00, 0.00);
  vec3 col = acid * light + vec3(1.0) * pow(light, 2.2) * 0.5;

  // fondo grafito
  vec3 bg = vec3(0.075, 0.066, 0.105);
  col += bg;

  // grano sutil
  col -= hash(uv * uRes.xy + uTime) * 0.018;

  // viñeta marcada → más dramatismo / foco central
  float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
  col *= mix(0.4, 1.0, vig);

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
