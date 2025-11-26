// CONFIG
const SERVER_IP = "sharkymc.falixsrv.me";
const STATUS_API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

document.addEventListener("DOMContentLoaded", () => {
    // copy IP buttons
    document.getElementById("copyJava").onclick = () => {
        navigator.clipboard.writeText(SERVER_IP);
    };

    document.getElementById("copyBedrock").onclick = () => {
        navigator.clipboard.writeText(SERVER_IP + ":42914");
    };

    // status check
    async function updateStatus() {
        try {
            const r = await fetch(STATUS_API);
            const j = await r.json();

            const dot = document.getElementById("statusDot");
            const count = document.getElementById("playersCount");
            const motd = document.getElementById("serverMotd");

            if (j.online) {
                dot.style.background = "#2fdc9b";
                count.textContent = `${j.players.online} players online`;
                motd.textContent = j.motd?.clean?.join(" ") || "";
            } else {
                dot.style.background = "#ff6b6b";
                count.textContent = "Server offline";
                motd.textContent = "";
            }
        } catch (e) {
            //
        }
    }

    updateStatus();
    setInterval(updateStatus, 8000);

    initBGCanvas();
});

/* BACKGROUND PARTICLES */
function initBGCanvas() {
    const c = document.getElementById("bgCanvas");
    const ctx = c.getContext("2d");

    c.width = innerWidth;
    c.height = innerHeight;

    const parts = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
        parts.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            r: Math.random() * 4 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            a: Math.random() * 0.3
        });
    }

    function draw() {
        ctx.clearRect(0, 0, c.width, c.height);

        for (let p of parts) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${p.a})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x > c.width) p.x = 0;
            if (p.x < 0) p.x = c.width;
            if (p.y > c.height) p.y = 0;
            if (p.y < 0) p.y = c.height;
        }
        requestAnimationFrame(draw);
    }
    draw();
}
