import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  word?: string; // Optional: solved letters to shoot out
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'square' | 'circle' | 'letter';
  text?: string;
  rotation: number;
  spin: number;
  alpha: number;
}

export const Confetti = ({ active, word = '' }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let particles: ConfettiParticle[] = [];

    // Resize canvas
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const colors = ['#4ade80', '#fb923c', '#a78bfa', '#38bdf8', '#fbbf24'];
    const characters = ['W', 'M', ...word.toUpperCase().split('')];

    // Initialize 80 particles from the center/bottom of the container
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.8; // explode from lower portion

    for (let i = 0; i < 80; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shapes: ('square' | 'circle' | 'letter')[] = ['square', 'circle', 'letter'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const text = shape === 'letter' ? characters[Math.floor(Math.random() * characters.length)] : undefined;

      particles.push({
        x: startX + (Math.random() - 0.5) * 40,
        y: startY,
        vx: (Math.random() - 0.5) * 16, // random -8 to +8
        vy: -Math.random() * 10 - 6,   // random -16 to -6
        size: Math.random() * 8 + 6,
        color,
        shape,
        text,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }

    const gravity = 0.35;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0) continue;
        alive = true;

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.rotation += p.spin;
        p.alpha -= 0.008; // fade out over ~3s

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'letter' && p.text) {
          ctx.font = `black ${p.size * 1.5}px sans-serif`;
          ctx.fillText(p.text, -p.size / 2, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Square
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }

      if (alive) {
        animFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [active, word]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-50 pointer-events-none w-full h-full rounded-2xl"
    />
  );
};
export default Confetti;
