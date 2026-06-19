import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame;
    let scrollY = 0;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    window.addEventListener("resize", resize);

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    // -------------------------
    // PARTICLE HUMAN FORM
    // -------------------------

    const particles = [];

    const PARTICLE_COUNT = 9000;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = (Math.random() - 0.5) * 900;

      let radius = 0;

      if (y < -280) {
        radius =
          120 *
          Math.exp(
            -Math.pow(y + 400, 2) /
              60000
          );
      } else if (y < -100) {
        radius = 75;
      } else {
        radius =
          200 *
          Math.exp(
            -(y * y) / 220000
          );
      }

      const angle =
        Math.random() *
        Math.PI *
        2;

      particles.push({
        x:
          Math.cos(angle) *
          radius,
        y,
        z:
          Math.sin(angle) *
          radius,
        seed:
          Math.random() *
          1000,
      });
    }

    function project(
      x,
      y,
      z,
      scale
    ) {
      const perspective = 1200;

      const depth =
        perspective /
        (perspective + z);

      return {
        x:
          x *
          depth *
          scale,
        y:
          y *
          depth *
          scale,
      };
    }

    function animate() {
      time += 0.008;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      const zoom =
        1 +
        Math.min(
          scrollY / 1200,
          1
        ) *
          0.8;

      ctx.save();

      ctx.translate(
        width / 2,
        height / 2
      );

      ctx.scale(
        zoom,
        zoom
      );

      const projected = [];

      const rotY =
        time * 0.12;

      const cos =
        Math.cos(rotY);

      const sin =
        Math.sin(rotY);

      // -----------------
      // DRAW PARTICLES
      // -----------------

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p =
          particles[i];

        const rx =
          p.x * cos -
          p.z * sin;

        const rz =
          p.x * sin +
          p.z * cos;

        const offset =
          Math.sin(
            time +
              p.seed
          ) *
          2.5;

        const point =
          project(
            rx,
            p.y + offset,
            rz,
            1
          );

        projected.push(
          point
        );

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          0.8,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "rgba(255,255,255,0.85)";

        ctx.fill();
      }

      // -----------------
      // WIRE CONNECTIONS
      // -----------------

      ctx.lineWidth = 0.5;

      for (
        let i = 0;
        i <
        projected.length;
        i += 12
      ) {
        const a =
          projected[i];

        for (
          let j =
            i + 12;
          j <
          Math.min(
            i + 180,
            projected.length
          );
          j += 12
        ) {
          const b =
            projected[j];

          const dx =
            a.x - b.x;
          const dy =
            a.y - b.y;

          const dist =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          if (
            dist < 35
          ) {
            const alpha =
              0.08 *
              (1 -
                dist /
                  35);

            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;

            ctx.beginPath();

            ctx.moveTo(
              a.x,
              a.y
            );

            ctx.lineTo(
              b.x,
              b.y
            );

            ctx.stroke();
          }
        }
      }

      ctx.restore();

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    animate();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

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
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}