import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { LoveRainCanvas } from './components/LoveRainCanvas'; // Asegúrate de que esta ruta sea correcta

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
        return savedCps ? parseInt(savedCps, 10) : 0; // Por defecto, 0 clics por segundo
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

    const [complimentRainSpeed, setComplimentRainSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('complimentRainSpeed');
        return savedSpeed ? parseInt(savedSpeed, 10) : 20; // Menor número = más rápido, 50ms default
    });

    const [emojiRainSpeed, setEmojiRainSpeed] = useState(() => {
        const savedSpeed = localStorage.getItem('emojiRainSpeed');
        return savedSpeed ? parseInt(savedSpeed, 10) : 30; // Menor número = más rápido, 100ms default
    });

    // --- DEFINICIÓN DE MEJORAS ---
    const upgrades = useRef([
        {
            id: 'clickPower1',
            name: 'Doble Caricia',
            description: 'Duplica el poder de tu clic.',
            cost: 50,
            effect: () => setClickPower(prev => prev * 2),
            purchased: false
        },
        {
            id: 'autoClicker1',
            name: 'Pensamiento Constante',
            description: 'Genera 1 clic por segundo automáticamente.',
            cost: 100,
            effect: () => setCps(prev => prev + 1),
            purchased: false
        },
        {
            id: 'complimentRainUnlock',
            name: 'Desbloquear Lluvia de Cumplidos',
            description: 'Los cumplidos empiezan a caer del cielo. Cada cumplido suma un clic. (No es una mejora para la lluvia, sino que la inicia).',
            cost: 250,
            effect: () => setComplimentRainActive(true),
            purchased: false
        },
        {
            id: 'complimentRainSpeed1',
            name: 'Aumentar Lluvia de Cumplidos (Nivel 1)',
            description: 'Los cumplidos caen más rápido (reduce el intervalo de caída).',
            cost: 500,
            effect: () => setComplimentRainSpeed(prev => Math.max(10, prev - 10)), // Mínimo 10ms
            purchased: false
        },
        {
            id: 'emojiRainUnlock',
            name: 'Desbloquear Lluvia de Emojis',
            description: 'Los emojis de amor caen del cielo. Cada emoji suma un clic. (No es una mejora para la lluvia, sino que la inicia).',
            cost: 750,
            effect: () => setEmojiRainActive(true),
            purchased: false
        },
        {
            id: 'emojiRainSpeed1',
            name: 'Aumentar Lluvia de Emojis (Nivel 1)',
            description: 'Los emojis caen más rápido (reduce el intervalo de caída).',
            cost: 1000,
            effect: () => setEmojiRainSpeed(prev => Math.max(20, prev - 20)), // Mínimo 20ms
            purchased: false
        }
        // ... puedes añadir más mejoras aquí
    ]);

    // Cargar estado de las mejoras desde localStorage al inicio
    useEffect(() => {
        const savedUpgrades = localStorage.getItem('gameUpgrades');
        if (savedUpgrades) {
            const parsedUpgrades = JSON.parse(savedUpgrades);
            upgrades.current = upgrades.current.map(initialUpgrade => {
                const saved = parsedUpgrades.find(su => su.id === initialUpgrade.id);
                return saved ? { ...initialUpgrade, purchased: saved.purchased } : initialUpgrade;
            });
        }
    }, []);


    // --- EFECTOS DE GUARDADO Y LÓGICA DEL JUEGO ---

    // Guardar estado en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('myZucaritaCount', count.toString());
        localStorage.setItem('clickPower', clickPower.toString());
        localStorage.setItem('cps', cps.toString());
        localStorage.setItem('complimentRainActive', JSON.stringify(complimentRainActive));
        localStorage.setItem('emojiRainActive', JSON.stringify(emojiRainActive));
        localStorage.setItem('complimentRainSpeed', complimentRainSpeed.toString());
        localStorage.setItem('emojiRainSpeed', emojiRainSpeed.toString());
        localStorage.setItem('gameUpgrades', JSON.stringify(upgrades.current.map(u => ({ id: u.id, purchased: u.purchased }))));
    }, [count, clickPower, cps, complimentRainActive, emojiRainActive, complimentRainSpeed, emojiRainSpeed]);


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
            createComplimentBurst(e.clientX, e.clientY);
            setCount(prevCount => prevCount + clickPower); // Usa clickPower
        };

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            createComplimentBurst(touch.clientX, touch.clientY);
            setCount(prevCount => prevCount + clickPower); // Usa clickPower
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
        const upgrade = upgrades.current.find(u => u.id === upgradeId);
        if (upgrade && !upgrade.purchased && count >= upgrade.cost) {
            setCount(prevCount => prevCount - upgrade.cost);
            upgrade.effect(); // Aplica el efecto de la mejora
            upgrade.purchased = true; // Marca como comprada
            // Forzar una re-renderización para actualizar la UI de las mejoras
            // Esto es un poco hacky, pero funciona para useRef.
            // Una mejor práctica sería usar un estado para `upgrades`,
            // pero esto cambiaría la estructura de useRef.
            // Para mantenerlo simple con useRef, podrías re-asignar para disparar el efecto de guardado
            localStorage.setItem('gameUpgrades', JSON.stringify(upgrades.current.map(u => ({ id: u.id, purchased: u.purchased }))));
            // También podrías agregar un estado auxiliar para forzar el re-renderizado de la lista de mejoras.
            // Por ejemplo, `const [upgradePurchased, setUpgradePurchased] = useState(false);`
            // y luego `setUpgradePurchased(prev => !prev);` aquí.
            // Y añadir `upgradePurchased` al array de dependencias donde se renderizan las mejoras.
        } else if (upgrade.purchased) {
            alert("¡Ya tienes esta mejora!");
        } else {
            alert("¡No tienes suficientes clicks!");
        }
    };

    // --- CARACTERÍSTICA ADICIONAL: "Momento Inspirador" ---
    const [lastInspirationTime, setLastInspirationTime] = useState(Date.now());
    const [inspirationReady, setInspirationReady] = useState(false);
    const inspirationCooldown = 10000; // 30 segundos

    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastInspirationTime > inspirationCooldown) {
                setInspirationReady(true);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastInspirationTime]);

    const triggerInspiration = () => {
        if (inspirationReady) {
            const bonusClicks = Math.floor(count * 0.1); // 10% de tus clicks actuales como bono
            setCount(prevCount => prevCount + bonusClicks);
            alert(`¡Momento Inspirador! Has ganado ${bonusClicks} clicks extra.`);
            setLastInspirationTime(Date.now());
            setInspirationReady(false);
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---
    return (
        <>
            <GalaxyCanvas />
            <div className="title-container">
                <h1 className="title">Mi Zucarita</h1>
                <div className="text-white">Clicks: {count}</div>
                <div className="text-white">CPS: {cps}</div>
                <div className="text-white">Poder de Clic: {clickPower}</div>
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
                onParticleCollect={() => setCount(prev => prev + 1)} // Cada vez que cae una partícula, suma 1 clic
            />

            {/* Tienda de Mejoras */}
            <div className="shop-container">
                <h2>Mejoras</h2>
                {upgrades.current.map(upgrade => (
                    <div
                        key={upgrade.id}
                        className={`upgrade-item ${upgrade.purchased ? 'upgrade-item-purchased' : 'upgrade-item-available'}`}
                    >
                        <div>
                            <h3>{upgrade.name}</h3>
                            <p>{upgrade.description}</p>
                        </div>
                        <button
                            onClick={() => buyUpgrade(upgrade.id)}
                            disabled={upgrade.purchased || count < upgrade.cost}
                            className={`upgrade-button ${upgrade.purchased ? 'upgrade-button-purchased' : 'upgrade-button-available'}`}
                        >
                            {upgrade.purchased ? 'Comprado' : `Comprar (${upgrade.cost} Clicks)`}
                        </button>
                    </div>
                ))}
            </div>

            {/* Botón de Momento Inspirador */}
            <button
                onClick={triggerInspiration}
                disabled={!inspirationReady}
                className='inspiration-button'
            >
                {inspirationReady ? '¡Momento Inspirador!' : 'Esperando Inspiración...'}
            </button>
        </>
    );
}