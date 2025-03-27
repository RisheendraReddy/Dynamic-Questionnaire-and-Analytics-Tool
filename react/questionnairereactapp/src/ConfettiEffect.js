import React, { useEffect } from 'react';

const ConfettiEffect = () => {
  useEffect(() => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '100';
    document.body.appendChild(canvas);

    // Get context
    const ctx = canvas.getContext('2d');

    // ASU colors
    const colors = ['#FFC324', '#A40145', '#8C1D40', '#D0D0D0', '#FFFFFF'];

    // Confetti particles
    const particles = [];

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * 2 * Math.PI;
        this.spin = Math.random() < 0.5 ? -0.05 : 0.05;
        this.shape = Math.random() < 0.33 ? 'circle' : Math.random() < 0.66 ? 'square' : 'triangle';
        this.opacity = 1;
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 1.5;
        this.angle += this.spin;
        this.opacity -= 0.005;
        
        if (this.y > canvas.height || this.opacity <= 0) {
          particles.splice(particles.indexOf(this), 1);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.shape === 'square') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Generate initial particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate new particles
      if (particles.length < 150 && Math.random() < 0.1) {
        particles.push(new Particle());
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      document.body.removeChild(canvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
};

export default ConfettiEffect;
