// Global Variables
let countdownIntervals = {};
let activeGames = new Set();

// Utility Functions
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const saveGameState = (gameId, timeRemaining, isActive) => {
    localStorage.setItem(`timeRemaining-${gameId}`, timeRemaining);
    localStorage.setItem(`gameState-${gameId}`, isActive ? 'active' : 'inactive');
};

const loadGameState = (gameId) => {
    const timeRemaining = localStorage.getItem(`timeRemaining-${gameId}`);
    const gameState = localStorage.getItem(`gameState-${gameId}`);
    return {
        timeRemaining: timeRemaining ? parseInt(timeRemaining) : null,
        isActive: gameState === 'active'
    };
};

// UI Update Functions
const updateGameUI = (gameId, isActive) => {
    const imageBox = document.querySelector(`.image-box[data-game-id="${gameId}"]`);
    const image = imageBox.querySelector('img');
    const checkmark = imageBox.querySelector('.checkmark');
    const button = imageBox.querySelector('.play-button');

    if (isActive) {
        image.style.opacity = '0.25';
        checkmark.style.display = 'block';
        button.classList.add('active');
        button.disabled = true;
    } else {
        image.style.opacity = '1';
        checkmark.style.display = 'none';
        button.classList.remove('active');
        button.disabled = false;
    }
};

// Game Control Functions
const startGame = (gameId) => {
    // ดึงค่า input โดยใช้ data-game-id ที่ตรงกับ gameId
    const timeInputElement = document.querySelector(`#timeInput-${gameId}`);
    let timeInputMinutes = parseInt(timeInputElement.value);

    if (isNaN(timeInputMinutes) || timeInputMinutes <= 0) { // ถ้าเป็น NaN หรือ <= 0 ให้ใช้ 1 นาที
        timeInputMinutes = 1;
    }

    const totalSeconds = timeInputMinutes * 60; // เปลี่ยนเวลาเป็นวินาที

    if (activeGames.has(gameId)) {
        console.log(`Game ${gameId} is already active`);
        return;
    }

    activeGames.add(gameId);
    updateGameUI(gameId, true);
    startCountdown(gameId, totalSeconds);
};


const startCountdown = (gameId, totalSeconds) => {
    const countdownDisplay = document.getElementById(`countdownDisplay-${gameId}`);
    let timeRemaining = totalSeconds;

    const updateCountdown = () => {
        countdownDisplay.textContent = formatTime(timeRemaining);
        saveGameState(gameId, timeRemaining, true);

        if (timeRemaining <= 0) {
            clearInterval(countdownIntervals[gameId]);
            endGame(gameId);
        } else {
            timeRemaining--; // ลดลงทีละ 1 วินาที
        }
    };

    clearInterval(countdownIntervals[gameId]);
    countdownIntervals[gameId] = setInterval(updateCountdown, 1000); // อัพเดตทุก 1 วินาที
    updateCountdown();
};

const endGame = (gameId) => {
    clearInterval(countdownIntervals[gameId]);
    activeGames.delete(gameId);
    
    const countdownDisplay = document.getElementById(`countdownDisplay-${gameId}`);
    countdownDisplay.textContent = "พร้อมให้ยืม";
    
    updateGameUI(gameId, false);
    saveGameState(gameId, 0, false);
    
    // Show completion notification
    showNotification(`เกม ${gameId} พร้อมให้ยืมแล้ว!`);
};

// Notification System
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00b09b, #96c93d);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all play buttons
    document.querySelectorAll('.play-button').forEach(button => {
        const gameId = button.closest('.image-box').dataset.gameId;
        
        button.addEventListener('click', () => {
            startGame(gameId);
        });

        // Restore game state if active
        const state = loadGameState(gameId);
        if (state.isActive && state.timeRemaining > 0) {
            startCountdown(gameId, state.timeRemaining);
            updateGameUI(gameId, true);
        }
    });

    // Add back to top functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add scroll animations
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.image-box').forEach(box => {
        observer.observe(box);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

//function การใช้ DOM หรือการค้นหาข้อมูลโดยการกรองข้อมูลจากแท็ค <p> ที่แสดงผลอยู่บริวเณหน้าเว็บ
function searchBoardGame(event) {
    event.preventDefault();  // ป้องกันไม่ให้ฟอร์มรีเฟรชหน้า
    const query = document.getElementById('searchInput').value.toLowerCase();
    const gameBoxes = document.querySelectorAll('.image-box');
    gameBoxes.forEach(gameBox => {
        const gameName = gameBox.querySelector('p').textContent.toLowerCase();
        if (gameName.includes(query)) {
            gameBox.style.display = 'block';  // แสดงบอร์ดเกม
        } else {
            gameBox.style.display = 'none';  // ซ่อนบอร์ดเกมที่ไม่ตรงกับคำค้นหา
        }
    });
}
