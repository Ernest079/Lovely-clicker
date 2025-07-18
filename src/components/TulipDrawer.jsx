import React, { useRef, useEffect } from 'react';

export const TulipDrawer = ({ coordinates }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'purple';
    ctx.fillStyle = 'pink';   // Color de relleno del tulipán
    ctx.lineWidth = 2;        // Grosor de la línea

    if (coordinates && coordinates.length > 1) {
      // Dibuja el tallo (ejemplo simple)
      ctx.beginPath();
      ctx.moveTo(coordinates[0].x, coordinates[0].y); // Punto de inicio del tallo
      ctx.lineTo(coordinates[0].x, coordinates[0].y + 100); // Tallo hacia abajo
      ctx.stroke();

      // Dibuja el cuerpo del tulipán usando las coordenadas
      ctx.beginPath();
      ctx.moveTo(coordinates[0].x, coordinates[0].y); // Mover al primer punto

      // Dibuja las líneas entre todos los puntos
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y);
      }
      ctx.closePath(); // Cierra el camino para formar la forma

      ctx.fill();   // Rellena la forma
      ctx.stroke(); // Dibuja el borde de la forma
    }

  }, [coordinates]); // Redibuja cuando las coordenadas cambien

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth * 0.8} // Ajusta el tamaño según sea necesario
      height={window.innerHeight * 0.8}
      style={{ border: '1px solid black' }}
    ></canvas>
  );
};
