import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = null;
    let scrollY = 0;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles = [];
    const PARTICLE_COUNT = 5200;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const createHorizontalFigure = () => {
      particles.length = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = Math.random();
        const x = (t - 0.5) * 1000;

        let bandRadius = 0;
        const absX = Math.abs(x);

        if (absX < 140) {
          bandRadius = 170;
        } else if (absX < 320) {
          bandRadius = 130;
        } else if (absX < 470) {
          bandRadius = 92;
        } else {
          bandRadius = 48;
        }

        const angle = Math.random() * Math.PI * 2;
        const y = Math.cos(angle) * bandRadius * (0.28 + Math.random() * 0.95);
        const z = Math.sin(angle) * bandRadius * (0.55 + Math.random() * 1.15);

        particles.push({
          x,
          y,
          z,
          size: Math.random() * 1.2 + 0.45,
          alpha: Math.random() * 0.45 + 0.18,
          seed: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const project = (x, y, z, scale) => {
      const perspective = 1400;
      const depth = perspective / (perspective + z);

      return {
        x: x * depth * scale,
        y: y * depth * scale,
        depth,
      };
    };

    resize();
    createHorizontalFigure();
    handleScroll();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#d7d7d7");
      gradient.addColorStop(0.24, "#9f9f9f");
      gradient.addColorStop(0.52, "#111111");
      gradient.addColorStop(1, "#000000");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      time += 0.0065;

      drawBackground();

      const scrollProgress = clamp(scrollY / 1200, 0, 1);
      const zoom = 0.9 + scrollProgress * 0.62;
      const rotateY = -0.18 + scrollProgress * 0.32;
      const rotateX = Math.sin(time * 0.7) * 0.04;

      const cosY = Math.cos(rotateY);
      const sinY = Math.sin(rotateY);
      const cosX = Math.cos(rotateX);
      const sinX = Math.sin(rotateX);

      const cloud = [];

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const waveY =
          p.y +
          Math.sin(time * 1.2 + p.seed) * (2.4 + p.drift) +
          Math.cos(time * 0.8 + p.x * 0.01) * 1.4;

        const waveZ =
          p.z + Math.sin(time + p.seed * 1.3) * 3.5;

        const x1 = p.x * cosY - waveZ * sinY;
        const z1 = p.x * sinY + waveZ * cosY;

        const y2 = waveY * cosX - z1 * sinX;
        const z2 = waveY * sinX + z1 * cosX;

        const point = project(x1, y2, z2, 1);

        cloud.push({
          x: point.x,
          y: point.y,
          z: z2,
          alpha: p.alpha * point.depth,
          size: p.size * point.depth,
        });
      }

      cloud.sort((a, b) => a.z - b.z);

      for (let i = 0; i < cloud.length; i++) {
        const p = cloud[i];
        const glow = clamp(p.alpha, 0.08, 0.9);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${glow})`;
        ctx.fill();
      }

      ctx.lineWidth = 0.42;

      for (let i = 0; i < cloud.length; i += 8) {
        const a = cloud[i];

        for (let j = i + 8; j < Math.min(i + 120, cloud.length); j += 8) {
          const b = cloud[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 26) {
            const alpha = (1 - dist / 26) * 0.09;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      const haze = ctx.createRadialGradient(0, 0, 20, 0, 0, Math.min(width, height) * 0.42);
      haze.addColorStop(0, "rgba(255,255,255,0.08)");
      haze.addColorStop(0.45, "rgba(255,255,255,0.03)");
      haze.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(-width, -height, width * 2, height * 2);

      ctx.restore();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}