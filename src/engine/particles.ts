export type ParticleType = 'classic' | 'speed' | 'ai' | 'duel' | 'campaign' | 'double' | 'number' | 'reverse' | 'hub';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay?: number;
  text?: string; // For digital numbers/binary particles
  angle?: number;
  spin?: number;
}

export class AmbientParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private type: ParticleType = 'hub';
  private active = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.resizeCanvas();
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.resizeCanvas();
  };

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public setType(type: ParticleType) {
    this.type = type;
    this.particles = [];
    // Pre-populate some particles
    const count = type === 'speed' ? 30 : 50;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  public start() {
    if (this.active) return;
    this.active = true;
    this.loop();
  }

  public stop() {
    this.active = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }

  private createParticle(prePopulate = false): Particle {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const x = Math.random() * w;
    const y = prePopulate ? Math.random() * h : h + 10; // Start at bottom unless pre-populating

    switch (this.type) {
      case 'speed': // Upward ember sparks
        return {
          x,
          y: prePopulate ? Math.random() * h : h + 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 3 - 2,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 30 + 10}, 100%, 60%)`, // Red-orange embers
          alpha: Math.random() * 0.8 + 0.2,
          decay: Math.random() * 0.01 + 0.005,
        };

      case 'classic': // Floating green leaf specks
        return {
          x: Math.random() * w,
          y: prePopulate ? Math.random() * h : -20, // Drift down/sideways
          vx: Math.random() * 1.2 - 0.2,
          vy: Math.random() * 1.5 + 0.5,
          size: Math.random() * 4 + 2,
          color: `rgba(${Math.floor(Math.random() * 50 + 74)}, ${Math.floor(Math.random() * 50 + 200)}, 128, 0.4)`,
          alpha: Math.random() * 0.5 + 0.2,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.02,
        };

      case 'ai': // Cosmic dust, slow drift in all directions
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2.5 + 0.5,
          color: Math.random() > 0.5 ? '#c084fc' : '#38bdf8', // Purple or light blue
          alpha: Math.random() * 0.6 + 0.1,
        };

      case 'number': // Digital numbers/binary floating down
        return {
          x: Math.random() * w,
          y: prePopulate ? Math.random() * h : -30,
          vx: 0,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 6 + 10,
          color: '#10b981', // Neon green
          alpha: Math.random() * 0.4 + 0.1,
          text: Math.random() > 0.5 ? '1' : '0',
        };

      case 'duel': // Split screen digital dots
        const isLeft = Math.random() > 0.5;
        return {
          x: isLeft ? Math.random() * (w / 2) : (w / 2) + Math.random() * (w / 2),
          y: prePopulate ? Math.random() * h : h + 10,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 3 + 1,
          color: isLeft ? '#38bdf8' : '#ef4444', // Sky blue vs Red
          alpha: Math.random() * 0.5 + 0.2,
        };

      case 'campaign': // Gentle water bubbles
        return {
          x,
          y: prePopulate ? Math.random() * h : h + 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 1.2 - 0.4,
          size: Math.random() * 6 + 2,
          color: 'rgba(255, 255, 255, 0.15)',
          alpha: Math.random() * 0.3 + 0.1,
        };

      case 'double': // Teal and blue specs
        return {
          x: Math.random() * w,
          y: prePopulate ? Math.random() * h : h + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.5 - 0.5,
          size: Math.random() * 3.5 + 1.5,
          color: Math.random() > 0.5 ? '#06b6d4' : '#10b981',
          alpha: Math.random() * 0.4 + 0.1,
        };

      case 'reverse': // Grey dust drifting
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 3 + 1,
          color: '#94a3b8',
          alpha: Math.random() * 0.3 + 0.1,
        };

      case 'hub':
      default: // Twinkling stars
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 0.5,
          color: '#fda4af', // Pink stars
          alpha: Math.random() * 0.8 + 0.2,
          decay: Math.random() > 0.5 ? 0.015 : -0.015, // Twinkle factor
        };
    }
  }

  private loop = () => {
    if (!this.active) return;
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update positions
      p.x += p.vx;
      p.y += p.vy;

      if (this.type === 'speed') {
        if (p.decay) p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) {
          this.particles[i] = this.createParticle(false);
        }
      } else if (this.type === 'classic') {
        if (p.angle !== undefined && p.spin !== undefined) {
          p.angle += p.spin;
          p.x += Math.sin(p.angle) * 0.3; // Swaying motion
        }
        if (p.y > h + 20 || p.x < -20 || p.x > w + 20) {
          this.particles[i] = this.createParticle(false);
          this.particles[i].y = -10; // Force top start
        }
      } else if (this.type === 'number') {
        if (p.y > h + 30) {
          this.particles[i] = this.createParticle(false);
          this.particles[i].y = -20;
        }
      } else if (this.type === 'hub') {
        // Twinkling effect: modify alpha
        if (p.decay) {
          p.alpha += p.decay;
          if (p.alpha >= 1 || p.alpha <= 0.1) {
            p.decay = -p.decay;
          }
        }
      } else {
        // Wrap/Respawn standard particles
        if (p.y < -10 || p.y > h + 20 || p.x < -10 || p.x > w + 10) {
          this.particles[i] = this.createParticle(false);
        }
      }
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;

      if (this.type === 'number' && p.text) {
        this.ctx.fillStyle = p.color;
        this.ctx.font = `${p.size}px monospace`;
        this.ctx.fillText(p.text, p.x, p.y);
      } else if (this.type === 'classic') {
        this.ctx.translate(p.x, p.y);
        if (p.angle !== undefined) this.ctx.rotate(p.angle);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        // Leaf shape
        this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}
export default AmbientParticles;
