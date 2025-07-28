import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { LoveRainCanvas } from './components/LoveRainCanvas';
// Asegúrate de que tu configuración de React importa index.css globalmente,
// o si no, podrías importarlo aquí si es necesario:
// import '../index.css';

export function App() {
    // --- ESTADO DEL JUEGO ---
    // Carga inicial desde localStorage
    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem('myZucaritaCount');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    const [clickPower, setClickPower] = useState(() => {
        const savedPower = localStorage.getItem('clickPower');
        return savedPower ? parseInt(savedPower, 10) : 1; // Por defecto, 1 clic por click
    });

    const [cps, setCps] = useState(() => {
        const savedCps = localStorage.getItem('cps');
        return savedCps ? parseFloat(savedCps) : 0; // Cambiado a parseFloat para cargar decimales de CPS
    });

    // Estado para gestionar si la lluvia de cumplidos/emojis está activa y su velocidad
    const [complimentRainActive, setComplimentRainActive] = useState(() => {
        const savedActive = localStorage.getItem('complimentRainActive');
        return savedActive ? JSON.parse(savedActive) : false;
    });

    const [emojiRainActive, setEmojiRainActive] = useState(() => {
        const savedActive = localStorage.getItem('emojiRainActive');
        return savedActive ? JSON.parse(savedActive) : false;
    });

    // Velocidades iniciales MÁS LENTAS para las lluvias
    const [complimentRainSpeed, setComplimentRainSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('complimentRainSpeed');
        return savedSpeed ? parseInt(savedSpeed, 10) : 50;
    });

    const [emojiRainSpeed, setEmojiRainSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('emojiRainSpeed');
        return savedSpeed ? parseInt(savedSpeed, 10) : 50;
    });

    // --- DEFINICIÓN DE MEJORAS Y ESTADO DE COSTOS DINÁMICOS ---
    // Definición base de las mejoras. 'initialCost' es el precio de la primera compra.
    const baseUpgrades = useRef([
        {
            id: 'clickPower1',
            name: 'Doble Caricia',
            description: 'Duplica el poder de tu clic.',
            initialCost: 100, // Costo inicial
            effect: () => setClickPower(prev => prev * 1.3),
            type: 'repeatable'
        },
        {
            id: 'autoClicker1',
            name: 'Pensamiento Constante',
            description: 'Genera mas clics por segundo automáticamente.',
            initialCost: 50, // Costo inicial
            effect: () => setCps(prev => prev + 0.20), // Aumenta en 0.20
            type: 'repeatable'
        },
        {
            id: 'complimentRainUnlock',
            name: 'Desbloquear Lluvia de Cumplidos',
            description: 'Los cumplidos empiezan a caer del cielo. Cada cumplido suma un clic. (No es una mejora para la lluvia, sino que la inicia).',
            initialCost: 250,
            effect: () => setComplimentRainActive(true),
            type: 'once'
        },
        {
            id: 'complimentRainSpeed',
            name: 'Aumentar Lluvia de Cumplidos',
            description: 'Los cumplidos caen más rápido.',
            initialCost: 500,
            effect: () => setComplimentRainSpeed(prev => Math.max(10, prev - 10)),
            type: 'repeatable'
        },
        {
            id: 'emojiRainUnlock',
            name: 'Desbloquear Lluvia de Emojis',
            description: 'Los emojis de amor caen del cielo. Cada emoji suma un clic. (No es una mejora para la lluvia, sino que la inicia).',
            initialCost: 750,
            effect: () => setEmojiRainActive(true),
            type: 'once'
        },
        {
            id: 'emojiRainSpeed',
            name: 'Aumentar Lluvia de Emojis',
            description: 'Los emojis caen más rápido.',
            initialCost: 1000,
            effect: () => setEmojiRainSpeed(prev => Math.max(10, prev - 10)),
            type: 'repeatable'
        }
    ]);

    // Estado para los costos actuales de las mejoras (dinámicos)
    const [upgradeCosts, setUpgradeCosts] = useState(() => {
        const savedUpgradeCosts = localStorage.getItem('upgradeCosts');
        if (savedUpgradeCosts) {
            return JSON.parse(savedUpgradeCosts);
        }
        // Si no hay costos guardados, usa los costos iniciales de baseUpgrades
        const initialCosts = {};
        baseUpgrades.current.forEach(upgrade => {
            initialCosts[upgrade.id] = upgrade.initialCost;
        });
        return initialCosts;
    });

    // Estado para las mejoras 'once' que han sido compradas
    const [purchasedOnceUpgrades, setPurchasedOnceUpgrades] = useState(() => {
        const savedPurchased = localStorage.getItem('purchasedOnceUpgrades');
        return savedPurchased ? JSON.parse(savedPurchased) : {};
    });

    // --- EFECTOS DE GUARDADO Y LÓGICA DEL JUEGO ---

    // Guardar estado en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('myZucaritaCount', count.toString());
        localStorage.setItem('clickPower', clickPower.toString());
        localStorage.setItem('cps', cps.toString()); // Guardar CPS como string (puede tener decimales)
        localStorage.setItem('complimentRainActive', JSON.stringify(complimentRainActive));
        localStorage.setItem('emojiRainActive', JSON.stringify(emojiRainActive));
        localStorage.setItem('complimentRainSpeed', complimentRainSpeed.toString());
        localStorage.setItem('emojiRainSpeed', emojiRainSpeed.toString());
        localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts)); // Guarda los costos dinámicos
        localStorage.setItem('purchasedOnceUpgrades', JSON.stringify(purchasedOnceUpgrades)); // Guarda las mejoras 'once'
    }, [count, clickPower, cps, complimentRainActive, emojiRainActive, complimentRainSpeed, emojiRainSpeed, upgradeCosts, purchasedOnceUpgrades]);


    // Lógica de clicks por segundo (CPS)
    useEffect(() => {
        if (cps > 0) {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount + cps);
            }, 1000); // Incrementa cada segundo

            return () => clearInterval(interval);
        }
    }, [cps]);

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
                setTimeout(() => { elogio.remove(); }, 2000);
            }
        };

        const handleClick = (e) => {
            // Solo crea el burst si el clic no es en un botón de mejora
            if (!e.target.closest('.upgrade-button') && !e.target.closest('.inspiration-button')) {
                createComplimentBurst(e.clientX, e.clientY);
                setCount(prevCount => prevCount + clickPower); // Usa clickPower
            }
        };

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            // Solo crea el burst si el toque no es en un botón de mejora
            if (!e.target.closest('.upgrade-button') && !e.target.closest('.inspiration-button')) {
                createComplimentBurst(touch.clientX, touch.clientY);
                setCount(prevCount => prevCount + clickPower); // Usa clickPower
            }
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
    }, [clickPower, complimentsBurst, colorsBurst]); // Asegúrate de que las dependencias estén correctas

    // --- FUNCIÓN PARA COMPRAR MEJORAS ---
    const buyUpgrade = (upgradeId) => {
        const upgrade = baseUpgrades.current.find(u => u.id === upgradeId);
        const currentCost = upgradeCosts[upgradeId];

        if (upgrade && count >= currentCost) {
            if (upgrade.type === 'once' && purchasedOnceUpgrades[upgradeId]) {
                alert("¡Ya tienes esta mejora!");
                return;
            }

            setCount(prevCount => prevCount - currentCost);
            upgrade.effect(); // Aplica el efecto de la mejora

            if (upgrade.type === 'once') {
                // Marca la mejora 'once' como comprada
                setPurchasedOnceUpgrades(prev => ({ ...prev, [upgradeId]: true }));
            } else if (upgrade.type === 'repeatable') {
                // Aumenta el costo de la mejora 'repeatable'
                setUpgradeCosts(prev => ({
                    ...prev,
                    // Aumenta el costo en 30% y redondea hacia abajo a un entero
                    [upgradeId]: Math.floor(prev[upgradeId] * 1.30)
                }));
            }
        } else {
            alert("¡No tienes suficientes clicks!");
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <>
            <GalaxyCanvas />
            <div className="game-container"> {/* Contenedor principal para organizar elementos */}
                <div className="header-section">
                    <h1 className="title">Mi Zucarita</h1>
                    <div className="stats-container">
                        <div className="stats-container">
                            <div className="stat-item">Clicks: {Math.floor(count)}</div> {/* MODIFICADO AQUÍ */}
                            <div className="stat-item">CPS: {Math.floor(cps)}</div>
                            <div className="stat-item">Poder de Clic: {Math.floor(clickPower)}</div>
                        </div>
                    </div>
                </div>

                {/* Este div es el "botón" principal del clicker */}
                <div className='button-heart'>
                    💖
                </div>

                <LoveRainCanvas
                    complimentRainActive={complimentRainActive}
                    emojiRainActive={emojiRainActive}
                    complimentRainSpeed={complimentRainSpeed}
                    emojiRainSpeed={emojiRainSpeed}
                    onParticleCollect={() => setCount(prev => prev + 0.10)} // Cada vez que cae una partícula, suma 1 clic
                />

                {/* Tienda de Mejoras */}
                <div className="shop-container">
                    <h2>Mejoras</h2>
                    {baseUpgrades.current.map(upgrade => (
                        <div
                            key={upgrade.id}
                            className={`upgrade-item ${upgrade.type === 'once' && purchasedOnceUpgrades[upgrade.id] ? 'upgrade-item-purchased' : 'upgrade-item-available'}`}
                        >
                            <div>
                                <h3>{upgrade.name}</h3>
                                <p>{upgrade.description}</p>
                            </div>
                            <button
                                onClick={() => buyUpgrade(upgrade.id)}
                                disabled={upgrade.type === 'once' && purchasedOnceUpgrades[upgrade.id] || count < upgradeCosts[upgrade.id]}
                                className={`upgrade-button ${upgrade.type === 'once' && purchasedOnceUpgrades[upgrade.id] ? 'upgrade-button-purchased' : 'upgrade-button-available'}`}
                            >
                                {upgrade.type === 'once' && purchasedOnceUpgrades[upgrade.id] ? 'Comprado' : `Comprar (${upgradeCosts[upgrade.id]} Clicks)`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}