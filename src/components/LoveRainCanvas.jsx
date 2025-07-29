import { useRef, useEffect, useCallback } from 'react';

export const LoveRainCanvas = ({
    complimentRainActive,
    emojiRainActive,
    complimentRainSpeed,
    emojiRainSpeed,
    onParticleCollect
}) => {
    const compliments = [
        "Cielito Lindo de Ojos Morenos", "Sonrisa perfecta", "Eres Wapisima",
        "BELLA", "Piel de Canela", "Labios de miel",
        "Mirada de Estrellas", "Eres un sueño", "Figura divina",
        "BOMBON", "Cabello hermoso", "PRECIOSA",
        "Radiante", "Eres magia", "Belleza sin igual",
        "De otro mundo", "Eres arte", "Diosa terrenal",
        "Hermosa por siempre", "Lo más bello del Universo", "Perfecta en todo",
        "Eres la mejor", "Belleza pura", "Me vuelves loco",
        "Eres increíble", "Me fascinas", "Todo en ti es perfecto",
        "Eres especial", "Mi razón", "Mi inspiración", "Mi Musa",  "Mi Todo",
        "Mas Bella que el mismo Cielo", 
    ];

    const symbols = ["❤️", "💖", "💘", "💝", "🌹", "✨", "🥰", "💕"];
    const colors = [
        "#ff55ff", "#ff77ff", "#ff99ff", "#ffbbff",
        "#ff00ff", "#cc00cc", "#aa00aa", "#ff66aa",
        "#ff0088", "#ff3377", "#ff5599", "#ff0099"
    ];
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const particles = useRef([]);

    const complimentTimer = useRef(null);
    const emojiTimer = useRef(null);

    const createNewParticle = useCallback((isText) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;

        const newParticle = {
            x: Math.random() * (canvas.width / dpr),
            y: -20,
            speed: 0.2 + Math.random() * 0.5, // Velocidad de caída más lenta
            size: isText ? 8 + Math.random() * 6 : 15 + Math.random() * 15,
            content: isText ?
                compliments[Math.floor(Math.random() * compliments.length)] :
                symbols[Math.floor(Math.random() * symbols.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: 0,
            opacity: 0.9,
            sway: Math.random() * 1 - 0.5,
            swaySpeed: 0.005 + Math.random() * 0.001, // Velocidad de oscilación más lenta
            isText: isText
        };
        particles.current.push(newParticle);
        if (onParticleCollect) {
            onParticleCollect();
        }
    }, [compliments, symbols, colors, onParticleCollect]);

    useEffect(() => {
        if (complimentRainActive) {
            if (complimentTimer.current) clearInterval(complimentTimer.current);
            complimentTimer.current = setInterval(() => {
                createNewParticle(true);
            }, complimentRainSpeed); // Usa la velocidad de lluvia de cumplidos del estado
        } else {
            if (complimentTimer.current) {
                clearInterval(complimentTimer.current);
                complimentTimer.current = null;
            }
        }
        return () => {
            if (complimentTimer.current) clearInterval(complimentTimer.current);
        };
    }, [complimentRainActive, complimentRainSpeed, createNewParticle]);

    useEffect(() => {
        if (emojiRainActive) {
            if (emojiTimer.current) clearInterval(emojiTimer.current);
            emojiTimer.current = setInterval(() => {
                createNewParticle(false);
            }, emojiRainSpeed); // Usa la velocidad de lluvia de emojis del estado
        } else {
            if (emojiTimer.current) {
                clearInterval(emojiTimer.current);
                emojiTimer.current = null;
            }
        }
        return () => {
            if (emojiTimer.current) clearInterval(emojiTimer.current);
        };
    }, [emojiRainActive, emojiRainSpeed, createNewParticle]);


    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        // Limita el número de partículas para mejorar el rendimiento
        const maxParticles = 30; // Ajusta este valor según sea necesario
        const currentParticles = particles.current.slice(-maxParticles); // Mantén solo las últimas N partículas

        particles.current.forEach((particle, index) => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.globalAlpha = particle.opacity;

            if (!particle.isText) {
                ctx.font = `${particle.size}px serif`;
                ctx.fillStyle = particle.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.content, 0, 0);
            } else {
                ctx.font = `bold ${particle.size}px 'Arial', sans-serif`;
                ctx.fillStyle = particle.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const words = particle.content.split(' ');
                if (words.length > 2 && particle.content.length > 12) {
                    const middle = Math.floor(words.length / 2);
                    const line1 = words.slice(0, middle).join(' ');
                    const line2 = words.slice(middle).join(' ');
                    ctx.fillText(line1, 0, -particle.size / 2);
                    ctx.fillText(line2, 0, particle.size / 2);
                } else {
                    ctx.fillText(particle.content, 0, 0);
                }
            }

            ctx.restore();

            particle.y += particle.speed;
            particle.x += particle.sway * Math.sin(particle.y * particle.swaySpeed);

            // Elimina partículas fuera de la pantalla
            if (particle.y > (canvas.height / dpr) + 50 || particle.x < -50 || particle.x > (canvas.width / dpr) + 50) {
                particles.current.splice(index, 1);
            }
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
                particles.current = []; // Limpia las partículas al redimensionar
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [animate]);

    return <canvas id="loveRain" ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}></canvas>;
};