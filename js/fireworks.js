const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

// 烟花发射
function launchFirework(sx, sy, tx, ty) {
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const distX = tx - sx;
    const distY = ty - sy;
    const distTotal = Math.sqrt(distX * distX + distY * distY);
    const distXNorm = distX / distTotal;
    const distYNorm = distY / distTotal;
    const velocity = distTotal / 100;
    const velocityX = velocity * distXNorm;
    const velocityY = velocity * distYNorm;
    const acceleration = 0.99;
    const explosionSpeed = 3;
    const explosionRadius = 5;
    const explosionDensity = 70;

    const firework = {
        x: sx,
        y: sy,
        sx,
        sy,
        tx,
        ty,
        distX,
        distY,
        distTotal,
        velocity,
        velocityX,
        velocityY,
        acceleration,
        color,
        explosionSpeed,
        explosionRadius,
        explosionDensity,
        coordinates: [],
        coordinateLength: 3,
        angle: 0,
        targetRadius: 1
    };

    for (let i = 0; i < firework.coordinateLength; i++) {
        firework.coordinates.push([firework.x, firework.y]);
    }

    fireworks.push(firework);
}

// 烟花爆炸
function explodeFirework(firework) {
    const { tx, ty, distX, distY, distTotal, explosionSpeed, explosionRadius, explosionDensity, color } = firework;
    const angle = Math.atan2(distY, distX);
    const velocity = explosionSpeed;
    const velocityX = velocity * Math.cos(angle);
    const velocityY = velocity * Math.sin(angle);

    for (let i = 0; i < explosionDensity; i++) {
        const particle = {
            x: tx,
            y: ty,
            originalX: tx,
            originalY: ty,
            angle: angle + (i / explosionDensity) * Math.PI * 2,
            velocity: velocity,
            velocityX: velocityX,
            velocityY: velocityY,
            life: 100,
            death: false,
            color
        };

        particles.push(particle);
    }
}

// 更新烟花
function updateFireworks() {
    for (let i = fireworks.length - 1; i >= 0; i--) {
        let firework = fireworks[i];
        firework.velocityX *= firework.acceleration;
        firework.velocityY *= firework.acceleration;
        firework.x += firework.velocityX;
        firework.y += firework.velocityY;

        firework.coordinates.push([firework.x, firework.y]);
        if (firework.coordinates.length > firework.coordinateLength) {
            firework.coordinates.shift();
        }

        const dx = firework.tx - firework.x;
        const dy = firework.ty - firework.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= firework.targetRadius) {
            explodeFirework(firework);
            fireworks.splice(i, 1);
        }
    }
}

// 更新粒子
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.velocityX *= particle.acceleration;
        particle.velocityY *= particle.acceleration;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        particle.life--;
        if (particle.life <= 0) {
            particle.death = true;
        }
    }

    particles = particles.filter(particle => !particle.death);
}

// 绘制烟花
function drawFireworks() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (const firework of fireworks) {
        ctx.beginPath();
        ctx.moveTo(firework.coordinates[0][0], firework.coordinates[0][1]);
        for (const coordinate of firework.coordinates) {
            ctx.lineTo(coordinate[0], coordinate[1]);
        }
        ctx.strokeStyle = firework.color;
        ctx.stroke();
    }
}

// 绘制粒子
function drawParticles() {
    for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.life * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    }
}

// 主循环
function loop() {
    requestAnimationFrame(loop);

    updateFireworks();
    updateParticles();
    drawFireworks();
    drawParticles();
}

// 自动发射烟花
function autoLaunchFireworks() {
    const sx = canvas.width / 2;
    const sy = canvas.height;
    const tx = Math.random() * canvas.width;
    const ty = Math.random() * canvas.height / 2;
    launchFirework(sx, sy, tx, ty);
}

setInterval(autoLaunchFireworks, 2000);

loop();