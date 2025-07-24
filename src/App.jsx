import { useEffect, useRef } from "react";
import { GalaxyCanvas } from "./components/GalaxyCanvas";
import { LoveRainCanvas } from "./components/LoveRainCanvas";

export function App() {

    const complimentsBurst = [
        "Hermosa", "Preciosa", "Radiante", "Divina",
        "Maravillosa", "Perfecta", "Increíble", "Única",
        "Especial", "Fantástica", "Sensacional", "Deslumbrante"
    ];

    const colorsBurst = [
        "#ff55ff", "#ff77ff", "#ff99ff", "#ffbbff",
        "#ff00ff", "#cc00cc", "#aa00aa", "#ff66aa",
        "#ff0088", "#ff3377", "#ff5599", "#ff0099"
    ];

    useEffect(() => {
        const createComplimentBurst = (x, y) => {
            const burstCount = 10 + Math.floor(Math.random() * 10);

            for (let i = 0; i < burstCount; i++) {
                const elogio = document.createElement('div');
                elogio.className = 'burst-text';
                elogio.textContent = complimentsBurst[Math.floor(Math.random() * complimentsBurst.length)];

                elogio.style.left = `${x}px`;
                elogio.style.top = `${y}px`;

                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                const size = 12 + Math.random() * 20;
                elogio.style.fontSize = `${size}px`;

                elogio.style.color = colorsBurst[Math.floor(Math.random() * colorsBurst.length)];

                elogio.style.setProperty('--tx', `${tx}px`);
                elogio.style.setProperty('--ty', `${ty}px`);

                document.body.appendChild(elogio);

                setTimeout(() => {
                    elogio.remove();
                }, 2000);
            }
        };

        const handleClick = (e) => {
            createComplimentBurst(e.clientX, e.clientY);
        };

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            createComplimentBurst(touch.clientX, touch.clientY);
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('touchstart', handleTouchStart);

        const handleGestureStart = (e) => {
            e.preventDefault();
        };
        document.addEventListener('gesturestart', handleGestureStart);


        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('gesturestart', handleGestureStart);
        };
    }, []);

    return (
        <>
            <GalaxyCanvas />
            <div className="title-container">
                <h1 className="title">Mi Zucarita</h1>
            </div>
            <LoveRainCanvas />
        </>
    );
}