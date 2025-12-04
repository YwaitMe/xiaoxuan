// 烟花系统
class FireworkSystem {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        this.fireworkCount = 3;
        this.lastFireworkTime = 0;
        this.fireworkInterval = 800;
        
        // 初始化画布
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 控制按钮事件
        this.setupControls();
        
        // 烟花效果类型
        this.fireworkTypes = [
            this.createCircleBurst.bind(this),
            this.createStarBurst.bind(this),
            this.createSpiralBurst.bind(this),
            this.createHeartBurst.bind(this),
            this.createDiamondBurst.bind(this),
            this.createWaveBurst.bind(this),
            this.createCrossBurst.bind(this),
            this.createRingBurst.bind(this)
        ];
        
        // 颜色预设
        this.colors = [
            ['#FF1493', '#FF69B4', '#FFB6C1'], // 粉色系
            ['#00BFFF', '#1E90FF', '#4169E1'], // 蓝色系
            ['#32CD32', '#90EE90', '#ADFF2F'], // 绿色系
            ['#FFD700', '#FFA500', '#FF8C00'], // 黄色/橙色系
            ['#FF4500', '#FF6347', '#FF7F50'], // 橙红色系
            ['#9370DB', '#8A2BE2', '#9932CC'], // 紫色系
            ['#FF1493', '#FF69B4', '#FFC0CB', '#FFB6C1'], // 多彩粉色
            ['#00FFFF', '#7FFFD4', '#00CED1', '#4682B4']  // 蓝绿色系
        ];
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupControls() {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');
        const fireworkCountSlider = document.getElementById('fireworkCount');
        const fireworkCountLabel = document.querySelector('label[for="fireworkCount"]');
        
        startBtn.addEventListener('click', () => this.start());
        stopBtn.addEventListener('click', () => this.stop());
        resetBtn.addEventListener('click', () => this.reset());
        
        fireworkCountSlider.addEventListener('input', (e) => {
            this.fireworkCount = parseInt(e.target.value);
            fireworkCountLabel.textContent = `烟花数量: ${this.fireworkCount}`;
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
    }
    
    reset() {
        this.stop();
        this.fireworks = [];
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
    }
    
    createFirework() {
        const x = Math.random() * (this.canvas.width - 200) + 100;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * 0.4) + 50;
        const speed = Math.random() * 3 + 5;
        const colorSet = this.colors[Math.floor(Math.random() * this.colors.length)];
        const burstType = this.fireworkTypes[Math.floor(Math.random() * this.fireworkTypes.length)];
        
        const firework = new Firework(x, y, targetY, speed, colorSet, burstType);
        this.fireworks.push(firework);
    }
    
    // 烟花爆炸类型
    createCircleBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const angleStep = (Math.PI * 2) / particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = i * angleStep;
            const speed = Math.random() * 3 + 2;
            const particle = new Particle(x, y, angle, speed, colorSet);
            particles.push(particle);
        }
        
        return particles;
    }
    
    createStarBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const points = 5;
        
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const speed = i % 2 === 0 ? Math.random() * 3 + 3 : Math.random() * 2 + 1;
            
            for (let j = 0; j < particleCount / (points * 2) + 1; j++) {
                const particleAngle = angle + (Math.random() - 0.5) * 0.5;
                const particleSpeed = speed + (Math.random() - 0.5) * 1;
                const particle = new Particle(x, y, particleAngle, particleSpeed, colorSet);
                particles.push(particle);
            }
        }
        
        return particles;
    }
    
    createSpiralBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const spirals = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const spiralIndex = i % spirals;
            const angle = (i / particleCount) * Math.PI * 6 + (spiralIndex * (Math.PI * 2 / spirals));
            const speed = (i / particleCount) * 3 + 1;
            const particle = new Particle(x, y, angle, speed, colorSet);
            particle.twist = 0.1;
            particles.push(particle);
        }
        
        return particles;
    }
    
    createHeartBurst(x, y, colorSet, particleCount) {
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 2;
            const r = 16;
            
            // 心形曲线公式
            const xOffset = r * 16 * Math.pow(Math.sin(t), 3);
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            
            const angle = Math.atan2(yOffset, xOffset);
            const speed = Math.random() * 2 + 1.5;
            const particle = new Particle(x, y, angle, speed, colorSet);
            particles.push(particle);
        }
        
        return particles;
    }
    
    createDiamondBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const points = 4;
        
        for (let i = 0; i < points; i++) {
            const angle = (i * Math.PI * 2) / points + Math.PI / 4;
            
            for (let j = 0; j < particleCount / points + 1; j++) {
                const particleAngle = angle + (Math.random() - 0.5) * 0.3;
                const speed = Math.random() * 3 + 2;
                const particle = new Particle(x, y, particleAngle, speed, colorSet);
                particles.push(particle);
            }
        }
        
        return particles;
    }
    
    createWaveBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const waves = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = Math.sin(angle * waves) * 50 + 100;
            const targetX = x + Math.cos(angle) * radius;
            const targetY = y + Math.sin(angle) * radius;
            const particleAngle = Math.atan2(targetY - y, targetX - x);
            const speed = Math.random() * 2 + 1.5;
            
            const particle = new Particle(x, y, particleAngle, speed, colorSet);
            particles.push(particle);
        }
        
        return particles;
    }
    
    createCrossBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const directions = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        
        for (let direction of directions) {
            for (let i = 0; i < particleCount / directions.length + 1; i++) {
                const angle = direction + (Math.random() - 0.5) * 0.2;
                const speed = Math.random() * 3 + 2;
                const particle = new Particle(x, y, angle, speed, colorSet);
                particles.push(particle);
            }
        }
        
        return particles;
    }
    
    createRingBurst(x, y, colorSet, particleCount) {
        const particles = [];
        const rings = 3;
        
        for (let ring = 0; ring < rings; ring++) {
            const ringRadius = (ring + 1) * 20;
            const ringParticleCount = Math.floor(particleCount / rings);
            
            for (let i = 0; i < ringParticleCount; i++) {
                const angle = (i / ringParticleCount) * Math.PI * 2;
                const speed = (ring + 1) * 0.8 + Math.random() * 1;
                const particle = new Particle(x, y, angle, speed, colorSet);
                particles.push(particle);
            }
        }
        
        return particles;
    }
    
    animate(currentTime = 0) {
        // 清除画布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 创建新烟花
        if (this.isRunning && currentTime - this.lastFireworkTime > this.fireworkInterval) {
            for (let i = 0; i < this.fireworkCount; i++) {
                setTimeout(() => this.createFirework(), i * 200);
            }
            this.lastFireworkTime = currentTime;
        }
        
        // 更新和绘制烟花
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.update();
            firework.draw(this.ctx);
            
            if (firework.shouldBurst()) {
                const newParticles = firework.burst();
                this.particles.push(...newParticles);
                this.fireworks.splice(i, 1);
            }
        }
        
        // 更新和绘制粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw(this.ctx);
            
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
        
        // 继续动画
        if (this.isRunning) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
        }
    }
}

// 烟花类
class Firework {
    constructor(x, y, targetY, speed, colorSet, burstFunction) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.speed = speed;
        this.colorSet = colorSet;
        this.burstFunction = burstFunction;
        this.velocityY = -speed;
        this.acceleration = 0.05;
        this.size = 3;
        this.trail = [];
        this.maxTrailLength = 10;
    }
    
    update() {
        // 更新位置
        this.velocityY += this.acceleration;
        this.y += this.velocityY;
        
        // 更新轨迹
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }
    
    draw(ctx) {
        // 绘制轨迹
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const trail = this.trail[i];
            const alpha = i / this.trail.length;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.colorSet[0];
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, this.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        
        // 绘制当前烟花
        ctx.fillStyle = this.colorSet[0];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    shouldBurst() {
        return this.velocityY >= 0;
    }
    
    burst() {
        const particleCount = 100 + Math.floor(Math.random() * 50);
        return this.burstFunction(this.x, this.y, this.colorSet, particleCount);
    }
}

// 粒子类
class Particle {
    constructor(x, y, angle, speed, colorSet) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = colorSet[Math.floor(Math.random() * colorSet.length)];
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
        this.twist = 0;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }
    
    update() {
        // 应用重力
        this.vy += this.gravity;
        
        // 应用旋转力
        if (this.twist) {
            const angle = Math.atan2(this.vy, this.vx) + this.twist;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
        
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 更新旋转
        this.rotation += this.rotationSpeed;
        
        // 更新生命值
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 绘制粒子
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// 初始化系统
const fireworksSystem = new FireworkSystem();

// 页面加载完成后初始化
window.addEventListener('load', () => {
    // 自动开始表演
    fireworksSystem.start();
});