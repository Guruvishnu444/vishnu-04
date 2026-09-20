import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../ThemeContext';

const NetworkSolarSystem = () => {
  const { dark } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring with optimized config
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Reduced particle count for better performance
  const particles = useMemo(() => {
    const newParticles = [];
    
    // 3 spiral arms with fewer particles
    const numArms = 3;
    const particlesPerArm = 60; // Reduced from 120
    const armSpread = 0.5;
    
    for (let arm = 0; arm < numArms; arm++) {
      const armAngle = (arm / numArms) * Math.PI * 2;
      
      for (let i = 0; i < particlesPerArm; i++) {
        const t = i / particlesPerArm;
        const spiralTightness = 3;
        
        const angle = armAngle + t * spiralTightness * Math.PI * 2;
        const radius = 50 + t * 350;
        
        const randomRadius = radius + (Math.random() - 0.5) * 40;
        const randomAngle = angle + (Math.random() - 0.5) * armSpread;
        
        newParticles.push({
          id: `arm-${arm}-${i}`,
          angle: randomAngle,
          radius: randomRadius,
          size: 1.5 + Math.random() * 2,
          opacity: 0.4 + Math.random() * 0.6,
          speed: 60 + t * 40,
          glowSize: 2 + Math.random() * 2,
        });
      }
    }
    
    // Dense center cluster - reduced
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60;
      
      newParticles.push({
        id: `center-${i}`,
        angle,
        radius,
        size: 1.5 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
        speed: 40 + Math.random() * 20,
        glowSize: 3 + Math.random() * 3,
      });
    }
    
    // Field stars - reduced
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 400 + Math.random() * 200;
      
      newParticles.push({
        id: `field-${i}`,
        angle,
        radius,
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
        speed: 100 + Math.random() * 50,
        glowSize: 2 + Math.random() * 2,
      });
    }

    return newParticles;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            particle={particle}
            mouseX={smoothMouseX}
            mouseY={smoothMouseY}
            dark={dark}
          />
        ))}
      </div>
    </div>
  );
};

// Optimized particle component
const Particle = ({ particle, mouseX, mouseY, dark }) => {
  const angleRef = useRef(particle.angle);
  const frameRef = useRef(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const rotationSpeed = (Math.PI * 2) / (particle.speed * 60);

    const animate = () => {
      frameRef.current++;
      
      // Update angle
      angleRef.current += rotationSpeed;
      
      // Calculate base position
      const baseX = Math.cos(angleRef.current) * particle.radius;
      const baseY = Math.sin(angleRef.current) * particle.radius;
      
      // Get mouse position
      const mx = mouseX.get();
      const my = mouseY.get();
      
      if (typeof window !== 'undefined' && elementRef.current) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate particle position in viewport
        const particleX = centerX + baseX;
        const particleY = centerY + baseY;
        
        // Calculate distance from mouse
        const dx = particleX - mx;
        const dy = particleY - my;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply repulsion
        let finalX = baseX;
        let finalY = baseY;
        
        const repulsionRadius = 120;
        const repulsionStrength = 60;
        
        if (distance < repulsionRadius && distance > 0) {
          const force = (1 - distance / repulsionRadius) * repulsionStrength;
          finalX += (dx / distance) * force;
          finalY += (dy / distance) * force;
        }
        
        // Apply transform directly for better performance
        elementRef.current.style.transform = `translate(${finalX}px, ${finalY}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [particle, mouseX, mouseY]);

  const particleColor = dark ? 'white' : 'black';
  const glowColor = dark 
    ? `0 0 ${particle.glowSize}px rgba(255, 255, 255, ${particle.opacity * 0.8}), 0 0 ${particle.glowSize * 2}px rgba(255, 255, 255, ${particle.opacity * 0.4})`
    : `0 0 ${particle.glowSize}px rgba(0, 0, 0, ${particle.opacity * 0.8}), 0 0 ${particle.glowSize * 2}px rgba(0, 0, 0, ${particle.opacity * 0.4})`;

  return (
    <div
      ref={elementRef}
      className="absolute left-1/2 top-1/2"
      style={{
        width: particle.size,
        height: particle.size,
        willChange: 'transform',
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          opacity: particle.opacity,
          backgroundColor: particleColor,
          boxShadow: glowColor,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [particle.opacity * 0.8, particle.opacity, particle.opacity * 0.8],
        }}
        transition={{
          duration: 2.5 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2,
        }}
      />
    </div>
  );
};

export default NetworkSolarSystem;
