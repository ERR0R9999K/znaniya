// ============ REVIEWS CONFIGURATION ============
const ReviewsConfig = [
    {
        nickname: "Mr_GE0RGECR",
        rating: 5,
        review: "Why would you ever need super rank when you have FreeRanksClient!!!"
    },
    {
        nickname: "Bloxdio_DreamVN",
        rating: 4.5,
        review: "Oh, in my opinion, I'm not sure if I can give it a 5 rating, but the experience is fantastic. There are many ranks with capes, and I'd rate it around 4.5 stars. The client sometimes doesn't work, and I thank you for creating it :>"
    },
    {
        nickname: "AdzenGhostYT",
        rating: 4.2,
        review: "Very nice client for those who want free ranks like YT, Super, and some custom ones. It's very easy to use, works perfectly, and no one gets banned when using it. It's completely free and usable by everyone, including guest accounts or accounts that aren't logged in. But it's not a real rank in Bloxd, and some custom ranks can't be used."
    },
    {
        nickname: "SunStar_lol",
        rating: 4.5,
        review: "I give it 4,5 stars; It's very interesting!"
    },
    {
        nickname: "ZoctixYT_Bloxd",
        rating: 4,
        review: "This is so good, and I have a super rank and YouTuber rank! :D But versions 4.4.1 and 4.4.4 are so laggy, while 4.0.0 is so good. I hope ERR0R9999K can fix the 4.4.1 and 4.4.4 versions so they have no lag."
    },
    {
        nickname: "ToughUkulele637717",
        rating: 5,
        review: "This is the best client I have ever seen! I've been using it for a long time and haven't been banned. Thanks to this client, I got free ranks in Bloxd.io! Many thanks to ERR0R9999K for creating this client! The installation is very fast, and getting ranks through Discord didn't take much time. I recommend everyone to install FreeRanksClient!"
    }
];

// ============ END OF REVIEWS CONFIGURATION ============

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Пропускаем пустые ссылки и ссылки только с #
            if (!href || href === '#' || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Home link scroll to top
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Load reviews when page loads
    loadReviews();
});

// Modal functions for Verified rank
function openVerifiedModal() {
    const modal = document.getElementById('verified-modal');
    if (modal) modal.style.display = 'flex';
}

function closeVerifiedModal() {
    const modal = document.getElementById('verified-modal');
    if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('verified-modal');
    if (event.target === modal) {
        closeVerifiedModal();
    }
});

// Close modal on Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVerifiedModal();
    }
});

// ============ REVIEWS SYSTEM ============

// Database URL for player data
const DATABASE_URL = 'https://script.google.com/macros/s/AKfycbxBbj28o3llFuUN0HCdirAd6dEBO326qusx_7E5mxA9LQnNGokB_G2ZAQGUzza41Lyq/exec';

// Bloxd Colors mapping (for nickname colors)
const BloxdColors = {
    'Default': '#dff8ff',
    'Frost': '#dff8ff',
    'Lemon': '#ffff66',
    'Sprout': '#b3ff66',
    'Neon': '#66ff66',
    'Mint': '#66ffb3',
    'Cyan': '#66ffff',
    'Azure': '#66bcff',
    'Orchid': '#cc66ff',
    'Bubblegum': '#ff80bb',
    'Coral': '#ff6666',
    'Apricot': '#ffaa66',
    'Amber': '#ffcc66'
};

// Global ranks config
let globalRanksConfig = null;
let allPlayersData = [];

// Helper function to get color from BloxdColors
function getColorFromBloxd(colorValue) {
    if (!colorValue) return null;
    if (BloxdColors[colorValue]) {
        return BloxdColors[colorValue];
    }
    if (colorValue && colorValue.startsWith('#')) {
        return colorValue;
    }
    return null;
}

// Get nickname color with BloxdColors support
function getNicknameColor(colorValue) {
    const color = getColorFromBloxd(colorValue);
    if (color) return color;
    if (colorValue && !colorValue.startsWith('#')) return '#ffffff';
    return colorValue || '#ffffff';
}

// Get all name rank icons from global config
function getNameRankIcons(ranksList) {
    if (!globalRanksConfig || !globalRanksConfig.ranks || !ranksList) return '';
    
    try {
        const playerRanks = ranksList.split(',').map(r => r.trim());
        let icons = [];
        
        playerRanks.forEach(rankId => {
            const rankConfig = globalRanksConfig.ranks.find(r => r.id === rankId);
            if (rankConfig && rankConfig.namerank && rankConfig.namerank.length > 0) {
                rankConfig.namerank.forEach(item => {
                    icons.push(item);
                });
            }
        });
        
        return icons.join(' ');
    } catch (e) {
        console.error('Error getting name rank icons:', e);
        return '';
    }
}

// Fetch players from Google Apps Script
async function fetchPlayersForReviews() {
    try {
        const response = await fetch(DATABASE_URL);
        const players = await response.json();
        allPlayersData = players;
        
        // Get global ranks config from first player that has it
        const firstPlayerWithConfig = players.find(p => p.config && p.config.trim() !== '');
        if (firstPlayerWithConfig) {
            try {
                globalRanksConfig = JSON.parse(firstPlayerWithConfig.config);
            } catch (e) {
                console.error('Error parsing global config:', e);
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error fetching players for reviews:', error);
        return false;
    }
}

// Find player by nickname
function findPlayerForReview(nickname) {
    if (!allPlayersData.length) return null;
    
    return allPlayersData.find(player => 
        player.nickname && player.nickname.toLowerCase() === nickname.toLowerCase()
    );
}

// Generate stars HTML - УНИВЕРСАЛЬНАЯ поддержка любых дробных оценок
function generateStars(rating) {
    // Ограничиваем рейтинг от 0 до 5
    const clampedRating = Math.max(0, Math.min(5, rating));
    
    // Количество полных звёзд (целая часть)
    const fullStars = Math.floor(clampedRating);
    
    // Дробная часть (0.0 - 0.99)
    const fractionalPart = clampedRating - fullStars;
    
    // Решаем, нужна ли половина звезды (если дробная часть >= 0.25 и < 0.75)
    const needHalfStar = fractionalPart >= 0.25 && fractionalPart < 0.75;
    
    // Нужна ли маленькая звезда для малых дробей (0.01 - 0.24)
    const needSmallStar = fractionalPart >= 0.01 && fractionalPart < 0.25;
    
    // Нужна ли большая звезда для больших дробей (0.75 - 0.99)
    const needLargeStar = fractionalPart >= 0.75;
    
    // Сколько пустых звёзд остаётся
    let filledCount = fullStars;
    if (needHalfStar || needSmallStar || needLargeStar) {
        filledCount += 1;
    }
    const emptyStars = 5 - filledCount;
    
    let starsHtml = '';
    
    // 1. Полные звёзды
    for (let i = 1; i <= fullStars; i++) {
        starsHtml += '<i class="fas fa-star review-star"></i>';
    }
    
    // 2. Дробная часть
    if (needHalfStar) {
        // Половина звезды (4.25 - 4.74)
        starsHtml += '<i class="fas fa-star-half-alt review-star"></i>';
    } else if (needSmallStar) {
        // Маленькая звезда с градиентом (4.01 - 4.24)
        const percent = Math.round((fractionalPart / 0.25) * 100);
        starsHtml += `<i class="fas fa-star review-star" style="background: linear-gradient(90deg, #FFD700 ${percent}%, #555 ${percent}%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; text-shadow: none;"></i>`;
    } else if (needLargeStar) {
        // Большая звезда с градиентом (4.75 - 4.99)
        const percent = Math.round(((fractionalPart - 0.75) / 0.25) * 100 + 75);
        starsHtml += `<i class="fas fa-star review-star" style="background: linear-gradient(90deg, #FFD700 ${percent}%, #555 ${percent}%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; text-shadow: none;"></i>`;
    }
    
    // 3. Пустые звёзды
    for (let i = 1; i <= emptyStars; i++) {
        starsHtml += '<i class="far fa-star review-star empty"></i>';
    }
    
    return starsHtml;
}

// Альтернативная версия generateStars - простая и надёжная (только половинки)
function generateStarsSimple(rating) {
    // Округляем до ближайшей половинки
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(roundedRating);
    
    let starsHtml = '';
    
    // Полные звёзды
    for (let i = 1; i <= fullStars; i++) {
        starsHtml += '<i class="fas fa-star review-star"></i>';
    }
    
    // Половина звезды
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt review-star"></i>';
    }
    
    // Пустые звёзды
    for (let i = 1; i <= emptyStars; i++) {
        starsHtml += '<i class="far fa-star review-star empty"></i>';
    }
    
    return starsHtml;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load and render reviews
async function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    try {
        // Show loading state
        reviewsContainer.innerHTML = `
            <div class="reviews-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading reviews...</p>
            </div>
        `;
        
        // Fetch player data from database
        await fetchPlayersForReviews();
        
        // Check if there are reviews
        if (!ReviewsConfig || ReviewsConfig.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="reviews-loading">
                    <i class="fas fa-comment"></i>
                    <p>No reviews yet. Be the first to leave a review!</p>
                </div>
            `;
            return;
        }
        
        // Generate reviews HTML
        let reviewsHtml = '';
        
        for (const review of ReviewsConfig) {
            // Find player in database by nickname
            const player = findPlayerForReview(review.nickname);
            
            // Get player styling from database if found
            const nicknameColor = player ? getNicknameColor(player.nickname_color) : '#ffffff';
            const nicknameStyle = player ? (player.style || '') : '';
            const rankIcons = player ? getNameRankIcons(player.ranks) : '';
            
            // Generate stars - используем простую версию для надёжности
            const starsHtml = generateStarsSimple(review.rating);
            
            reviewsHtml += `
                <div class="review-card">
                    <div class="review-header">
                        <img src="assets/images/profiles/${review.nickname}.png" 
                             alt="${escapeHtml(review.nickname)}" 
                             class="review-avatar"
                             onerror="this.src='assets/images/unloaded.png'">
                        <div class="review-user-info">
                            <div class="review-user-name">
                                <span class="review-rank-icons">${rankIcons}</span>
                                <span style="color: ${nicknameColor}; ${nicknameStyle}">${escapeHtml(review.nickname)}</span>
                            </div>
                            <div class="review-stars">
                                ${starsHtml}
                                <span style="font-size: 0.8rem; color: #888; margin-left: 8px;">${review.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-text">
                        <i class="fas fa-quote-left"></i> ${escapeHtml(review.review)}
                    </div>
                </div>
            `;
        }
        
        reviewsContainer.innerHTML = reviewsHtml;
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsContainer.innerHTML = `
            <div class="reviews-loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading reviews. Please try again later.</p>
            </div>
        `;
    }
}

// ============ DOWNLOAD MODAL ============

let recaptchaVerified = false;
let privacyConsent = false;

// Open download modal
function openDownloadModal(downloadUrl) {
    const modal = document.getElementById('download-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Сохраняем URL для скачивания
        modal.dataset.downloadUrl = downloadUrl;
        // Сбрасываем состояние
        resetDownloadModal();
        // Инициализируем капчу
        setTimeout(initRecaptcha, 100);
    }
}

// Close download modal
function closeDownloadModal() {
    const modal = document.getElementById('download-modal');
    if (modal) {
        modal.style.display = 'none';
        // Сбрасываем капчу при закрытии
        resetRecaptcha();
        // Сбрасываем состояние чекбокса и кнопки
        resetDownloadModal();
    }
}

// Reset modal state
function resetDownloadModal() {
    const checkbox = document.getElementById('privacy-consent');
    const btn = document.getElementById('confirm-download-btn');
    if (checkbox) checkbox.checked = false;
    if (btn) {
        btn.classList.remove('active');
        btn.disabled = true;
    }
    privacyConsent = false;
    // recaptchaVerified сбрасывается в resetRecaptcha()
}

// Reset reCAPTCHA
function resetRecaptcha() {
    const container = document.getElementById('recaptcha-container');
    if (container) {
        container.innerHTML = '';
    }
    // Удаляем стили капчи
    const styles = document.getElementById('recaptcha-styles');
    if (styles) {
        styles.remove();
    }
    recaptchaVerified = false;
}

// Init reCAPTCHA (simulated)
function initRecaptcha() {
    const container = document.getElementById('recaptcha-container');
    if (!container) return;
    
    // Проверяем, не добавлена ли уже капча
    if (container.querySelector('.g-recaptcha')) {
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // ТОЧНАЯ КОПИЯ вашей капчи из reCAPCHA.html
    const recaptchaDiv = document.createElement('div');
    recaptchaDiv.className = 'g-recaptcha';
    recaptchaDiv.innerHTML = `
        <div class="recaptcha-checkbox" id="recaptcha-checkbox">
            <div class="checkbox-container">
                <div class="checkmark">✓</div>
            </div>
            <div class="loading-spinner"></div>
            <span class="checkbox-label">I'm not a robot</span>
        </div>
        
        <div class="recaptcha-logo-container">
            <div class="recaptcha-logo-icon"></div>
            <div class="recaptcha-logo-text">reCAPTCHA</div>
        </div>
    `;
    container.appendChild(recaptchaDiv);
    
    // Добавляем ТОЧНЫЕ стили из вашего файла
    if (!document.getElementById('recaptcha-styles')) {
        const style = document.createElement('style');
        style.id = 'recaptcha-styles';
        style.textContent = `
            :root {
                --primary-color: #4285f4;
                --success-color: #0f9d58;
                --border-color: #dadce0;
                --text-color: #555;
                --dark-gray: #70757a;
            }
            
            @keyframes checkmark {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                80% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            @keyframes loading {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            #recaptcha-container {
                background: transparent;
                border: none;
                box-shadow: none;
            }
            
            .g-recaptcha {
                width: 302px;
                height: 66px;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
                display: flex;
                align-items: center;
                padding: 0 14px;
                box-sizing: border-box;
            }
            
            .recaptcha-checkbox {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                height: 100%;
                flex-grow: 1;
                position: relative;
            }
            
            .checkbox-container {
                position: relative;
                width: 24px;
                height: 24px;
                border: 2px solid var(--border-color);
                border-radius: 3px;
                background: white;
                transition: all 0.2s ease;
                margin-right: 14px;
                flex-shrink: 0;
            }
            
            .recaptcha-checkbox.checked .checkbox-container {
                background: var(--success-color);
                border-color: var(--success-color);
            }
            
            .recaptcha-checkbox.loading .checkbox-container {
                opacity: 0;
            }
            
            .checkmark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 16px;
                font-weight: bold;
                opacity: 0;
            }
            
            .recaptcha-checkbox.checked .checkmark {
                animation: checkmark 0.3s ease-out forwards;
            }
            
            .loading-spinner {
                position: absolute;
                left: 12px;
                top: 50%;
                width: 30px;
                height: 30px;
                border: 3px solid rgba(66, 133, 244, 0.2);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: loading 1s linear infinite;
                display: none;
                transform: translateY(-50%);
            }
            
            .recaptcha-checkbox.loading .loading-spinner {
                display: block;
            }
            
            .checkbox-label {
                font-size: 14px;
                color: var(--dark-gray);
                font-weight: 400;
            }
            
            .recaptcha-logo-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 14px;
            }
            
            .recaptcha-logo-icon {
                width: 24px;
                height: 24px;
                background: url('https://www.gstatic.com/images/icons/material/product/2x/recaptcha_48dp.png') no-repeat center;
                background-size: contain;
            }
            
            .recaptcha-logo-text {
                font-size: 9px;
                color: var(--dark-gray);
                margin-top: 2px;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ТОЧНАЯ КОПИЯ JS из вашего файла
    const recaptchaCheckbox = document.getElementById('recaptcha-checkbox');
    if (recaptchaCheckbox) {
        let isVerified = false;
        
        function getRandomDelay() {
            return 1000 + Math.random() * 2000;
        }
        
        // Убираем старые обработчики
        const newCheckbox = recaptchaCheckbox.cloneNode(true);
        recaptchaCheckbox.parentNode.replaceChild(newCheckbox, recaptchaCheckbox);
        
        newCheckbox.addEventListener('click', function() {
            if (isVerified) return;
            
            // Начало проверки
            this.classList.add('loading');
            
            setTimeout(() => {
                // Успешная проверка
                this.classList.remove('loading');
                this.classList.add('checked');
                isVerified = true;
                recaptchaVerified = true;
                checkDownloadReady();
            }, getRandomDelay());
        });
        
        newCheckbox.addEventListener('dblclick', function() {
            if (isVerified) {
                this.classList.remove('checked', 'loading');
                isVerified = false;
                recaptchaVerified = false;
                checkDownloadReady();
            }
        });
    }
}

// Check if download is ready
function checkDownloadReady() {
    const btn = document.getElementById('confirm-download-btn');
    if (!btn) return;
    
    const isReady = privacyConsent && recaptchaVerified;
    if (isReady) {
        btn.classList.add('active');
        btn.disabled = false;
    } else {
        btn.classList.remove('active');
        btn.disabled = true;
    }
}

// Setup download modal events
document.addEventListener('DOMContentLoaded', function() {
    // Privacy checkbox
    const checkbox = document.getElementById('privacy-consent');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            privacyConsent = this.checked;
            checkDownloadReady();
        });
    }
    
    // Confirm download button
    const confirmBtn = document.getElementById('confirm-download-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const modal = document.getElementById('download-modal');
            if (modal && modal.dataset.downloadUrl) {
                window.open(modal.dataset.downloadUrl, '_blank');
                closeDownloadModal();
            }
        });
    }
    
    // Close modal on click outside
    const modal = document.getElementById('download-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeDownloadModal();
            }
        });
    }
    
    // Close modal on Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDownloadModal();
        }
    });
});
