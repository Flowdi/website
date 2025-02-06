const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%+-=';
const fontSize = 20;
const columns = canvas.width / fontSize;
const drops = Array(columns).fill(0);

let hue = 0;
window.addEventListener('mousemove', (e) => {
    hue = Math.floor((e.clientX / window.innerWidth) * 360);
});

// Hauptfunktion für den Matrix-Effekt
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;

    // Zeichne die Matrix-Zeichen
    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Farbton basierend Mausposition
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Wiederhole die Matrix-Zeichnung alle 50ms
setInterval(drawMatrix, 50);
