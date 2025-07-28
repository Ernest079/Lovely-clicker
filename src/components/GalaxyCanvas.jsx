import { useRef, useEffect, useCallback } from 'react';

export const GalaxyCanvas = () => {

  class Star {
    constructor(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 1.2;
      this.brightness = 0.1 + Math.random() * 0.9;
      this.speed = 0.1 + Math.random() * 0.3;
      this.opacity = 0;
      this.targetOpacity = this.brightness;
      this.twinkleSpeed = 0.01 + Math.random() * 0.05;
    }

    update(canvasHeight) {
      this.y += this.speed;
      if (this.y > canvasHeight) {
        this.y = 0;
        this.x = Math.random() * window.innerWidth;
      }

      if (Math.random() < 0.005) {
        this.targetOpacity = Math.random() * this.brightness;
      }

      if (this.opacity < this.targetOpacity) {
        this.opacity += this.twinkleSpeed;
      } else if (this.opacity > this.targetOpacity) {
        this.opacity -= this.twinkleSpeed;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }
  const canvasRef = useRef(null);
    const animationFrameId = useRef(null);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = 'rgba(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        if (!animate.stars) {
            animate.stars = [];
            for (let i = 0; i < 400; i++) {
                animate.stars.push(new Star(canvas.width / dpr, canvas.height / dpr));
            }
        }

        if (Math.random() < 0.02) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * (canvas.width / dpr),
                Math.random() * (canvas.height / dpr),
                1 + Math.random() * 0.8,
                0, Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }

        animate.stars.forEach(star => {
            star.update(canvas.height / dpr);
            star.draw(ctx);
        });

        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        animate();
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.getContext('2d').scale(dpr, dpr);
                animate.stars = [];
                for (let i = 0; i < 400; i++) {
                    animate.stars.push(new Star(canvas.width / dpr, canvas.height / dpr));
                }
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [animate]);

    return <canvas id="galaxyCanvas" ref={canvasRef}></canvas>;
}