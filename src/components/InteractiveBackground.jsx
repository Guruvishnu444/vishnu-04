import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let scrollY = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // ------------------------
    // HUMAN FORM PARTICLES
    // ------------------------

    const particles = [];

    const PARTICLE_COUNT = 6500;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = (Math.random() - 0.5) * 850;

      let radius;

      if (y < -250) {
        radius = 130 * Math.exp(-((y + 380) ** 2) / 50000);
      } else if (y < 0) {
        radius = 70;
      } else {
        radius = 170 * Math.exp(-(y * y) / 250000);
      }

      const angle = Math.random() * Math.PI * 2;

      particles.push({
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
        seed: Math.random() * 1000,
      });
    }

    let time = 0;
    let frame;

    function project(x, y, z, scale) {
      const perspective = 900;

      const depth = perspective / (perspective + z);

      return {
        x: x * depth * scale,
        y: y * depth * scale,
      };
    }

    function animate() {
      time += 0.01;

      ctx.clearRect(0, 0, width, height);

      const zoom =
        1 + Math.min(scrollY / 1200, 1) * 0.9;

      ctx.save();

      ctx.translate(width / 2, height / 2);

      ctx.scale(zoom, zoom);

      const projected = [];

      // --------------------
      // PARTICLES
      // --------------------

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const rotation =
          time * 0.15;

        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        const rx =
          p.x * cos -
          p.z * sin;

        const rz =
          p.x * sin +
          p.z * cos;

        const wave =
          Math.sin(
            time +
              p.seed +
              p.y * 0.01
          ) * 3;

        const point = project(
          rx,
          p.y + wave,
          rz,
          1
        );

        projected.push(point);

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          0.9,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "rgba(255,255,255,0.85)";

        ctx.fill();
      }

      // --------------------
      // CONNECTIONS
      // --------------------

      ctx.strokeStyle =
        "rgba(255,255,255,0.05)";

      ctx.lineWidth = 0.5;

      const step = 8;

      for (
        let i = 0;
        i < projected.length;
        i += step
      ) {
        const a = projected[i];

        for (
          let j = i + step;
          j < Math.min(i + 80, projected.length);
          j += step
        ) {
          const b = projected[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const dist =
            Math.sqrt(
              dx * dx + dy * dy
            );

          if (dist < 28) {
            ctx.beginPath();

            ctx.moveTo(a.x, a.y);

            ctx.lineTo(b.x, b.y);

            ctx.stroke();
          }
        }
      }

      ctx.restore();

      frame =
        requestAnimationFrame(
          animate
        );
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}