// 结果数据
const animalResults = [
    { icon: '🐷', text: '你是一只可爱的小猪猪！' },
    { icon: '🐶', text: '你是一只忠诚的小狗狗！' },
    { icon: '🐱', text: '你是一只优雅的小猫咪！' },
    { icon: '🐰', text: '你是一只活泼的小兔子！' },
    { icon: '🐻', text: '你是一只温暖的小熊熊！' },
    { icon: '🐼', text: '你是一只珍稀的小熊猫！' },
    { icon: '🐨', text: '你是一只慵懒的小考拉！' },
    { icon: '🐯', text: '你是一只威风的小老虎！' },
    { icon: '🦁', text: '你是一只勇敢的小狮子！' },
    { icon: '🐮', text: '你是一只勤劳的小奶牛！' },
    { icon: '🐸', text: '你是一只跳跃的小青蛙！' },
    { icon: '🐵', text: '你是一只机灵的小猴子！' },
    { icon: '🐔', text: '你是一只早起的小公鸡！' },
    { icon: '🐦', text: '你是一只自由的小鸟儿！' },
    { icon: '🐺', text: '你是一只神秘的小狼崽！' }
];

// DOM元素
const longPressArea = document.getElementById('longPressArea');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const resultContainer = document.getElementById('resultContainer');
const resultIcon = document.getElementById('resultIcon');
const resultText = document.getElementById('resultText');
const hint = document.getElementById('hint');
const themeToggle = document.getElementById('themeToggle');

// 长按变量
let longPressTimer;
let isLongPressing = false;
let progress = 0;
const requiredPressTime = 2000; // 2秒
const updateInterval = 50; // 50ms更新一次进度

// 检查本地存储的结果
const savedResult = localStorage.getItem('animalResult');
if (savedResult) {
    const result = JSON.parse(savedResult);
    showResult(result);
}

// 检查本地存储的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleText(savedTheme);
}

// 长按开始事件
function startLongPress() {
    if (savedResult) return; // 如果已有结果，不允许重新测试
    
    isLongPressing = true;
    progress = 0;
    updateProgress();
    
    longPressTimer = setInterval(() => {
        if (isLongPressing) {
            progress += (updateInterval / requiredPressTime) * 100;
            if (progress >= 100) {
                progress = 100;
                clearInterval(longPressTimer);
                generateResult();
            }
            updateProgress();
        }
    }, updateInterval);
}

// 长按结束事件
function endLongPress() {
    if (isLongPressing && progress < 100) {
        isLongPressing = false;
        clearInterval(longPressTimer);
        resetProgress();
    }
}

// 更新进度条
function updateProgress() {
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

// 重置进度条
function resetProgress() {
    progress = 0;
    updateProgress();
}

// 生成随机结果
function generateResult() {
    const randomIndex = Math.floor(Math.random() * animalResults.length);
    const result = animalResults[randomIndex];
    
    // 保存结果到本地存储
    localStorage.setItem('animalResult', JSON.stringify(result));
    
    // 显示结果
    showResult(result);
}

// 显示结果
function showResult(result) {
    resultIcon.textContent = result.icon;
    resultText.textContent = result.text;
    
    // 隐藏测试区域，显示结果
    longPressArea.style.display = 'none';
    progressBar.style.display = 'none';
    progressText.style.display = 'none';
    resultContainer.style.display = 'block';
    
    // 更新提示文本
    hint.style.display = 'block';
}

// 添加长按事件监听
if (longPressArea) {
    // 鼠标事件
    longPressArea.addEventListener('mousedown', startLongPress);
    longPressArea.addEventListener('mouseup', endLongPress);
    longPressArea.addEventListener('mouseleave', endLongPress);
    
    // 触摸事件（移动设备）
    longPressArea.addEventListener('touchstart', startLongPress, { passive: true });
    longPressArea.addEventListener('touchend', endLongPress);
    longPressArea.addEventListener('touchcancel', endLongPress);
}

// 深色模式切换
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleText(newTheme);
    });
}

// 更新主题切换按钮文本
function updateThemeToggleText(theme) {
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.textContent = '☀️ 切换浅色模式';
        } else {
            themeToggle.textContent = '🌙 切换深色模式';
        }
    }
}

// 页面加载完成后检查URL参数（用于初始主题设置）
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkModeParam = urlParams.get('darkmode');
    
    if (darkModeParam === '1' && !savedTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeToggleText('dark');
    }
});