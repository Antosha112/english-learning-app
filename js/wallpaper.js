// ============================================
// УПРАВЛЕНИЕ ОБОЯМИ (Wallpaper Manager)
// Кнопка сверху справа с миниатюрами
// ============================================

// Ключ для сохранения в LocalStorage
const WALLPAPER_KEY = 'selected_wallpaper';

// Список обоев (8 штук) - без названий
const wallpapers = [
    { id: 1, file: 'wallpaper1.jpg' },
    { id: 2, file: 'wallpaper2.jpg' },
    { id: 3, file: 'wallpaper3.jpg' },
    { id: 4, file: 'wallpaper4.jpg' },
    { id: 5, file: 'wallpaper5.jpg' },
    { id: 6, file: 'wallpaper6.jpg' },
    { id: 7, file: 'wallpaper7.jpg' },
    { id: 8, file: 'wallpaper8.jpg' },
];

// ============================================
// 1. УСТАНОВИТЬ ОБОИ
// ============================================
function setWallpaper(imageFile) {
    if (!imageFile) {
        // Сброс на стандартный фон
        document.body.style.backgroundImage = '';
        document.body.style.backgroundColor = '#b4ddda';
        localStorage.removeItem(WALLPAPER_KEY);
        updateButtonState(null);
        return;
    }
    
    // Устанавливаем картинку как фон с затемнением
    document.body.style.backgroundImage = `
        linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
        url('images/${imageFile}')
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Сохраняем в LocalStorage
    localStorage.setItem(WALLPAPER_KEY, imageFile);
    updateButtonState(imageFile);
}

// ============================================
// 2. ЗАГРУЗИТЬ СОХРАНЁННЫЕ ОБОИ
// ============================================
function loadSavedWallpaper() {
    const saved = localStorage.getItem(WALLPAPER_KEY);
    if (saved) {
        setWallpaper(saved);
    }
}

// ============================================
// 3. ОБНОВИТЬ СОСТОЯНИЕ КНОПКИ
// ============================================
function updateButtonState(currentFile) {
    const btn = document.getElementById('wallpaperBtn');
    if (!btn) return;
    btn.innerHTML = '🖼️';
    btn.title = currentFile ? 'Сменить обои' : 'Выбрать обои';
}

// ============================================
// 4. ПОКАЗАТЬ ПАНЕЛЬ ВЫБОРА ОБОЕВ
// ============================================
function showWallpaperPanel() {
    // Закрываем если уже открыта
    let panel = document.getElementById('wallpaperPanel');
    if (panel) {
        panel.remove();
        return;
    }
    
    // Создаём панель
    panel = document.createElement('div');
    panel.id = 'wallpaperPanel';
    panel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 320px;
        width: 90%;
        max-height: 70vh;
        animation: slideDown 0.3s ease;
        border: 1px solid rgba(255,255,255,0.3);
        display: flex;
        flex-direction: column;
    `;
    
    // Заголовок
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
            <h4 style="margin: 0; color: #2c3e50; font-weight: normal; font-size: 16px;">
                Выбрать обои
            </h4>
            <button onclick="closeWallpaperPanel()" 
                    style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6; padding: 0 5px; line-height: 1; transition: 0.3s;"
                    onmouseover="this.style.color='#e74c3c'"
                    onmouseout="this.style.color='#95a5a6'">
                ×
            </button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; overflow-y: auto; padding-right: 5px; flex: 1;">
    `;
    
    // Добавляем миниатюры (3 колонки, чтобы поместились)
    wallpapers.forEach(wp => {
        const isActive = localStorage.getItem(WALLPAPER_KEY) === wp.file;
        panel.innerHTML += `
            <button onclick="setWallpaper('${wp.file}'); closeWallpaperPanel();" 
                    style="
                        padding: 0;
                        border: 3px solid ${isActive ? '#268e96' : 'transparent'};
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        overflow: hidden;
                        position: relative;
                        aspect-ratio: 1 / 1;
                        background: #e0e0e0;
                    "
                    onmouseover="this.style.transform='scale(1.05)'; this.style.borderColor='#268e96';"
                    onmouseout="this.style.transform='scale(1)'; this.style.borderColor='${isActive ? '#268e96' : 'transparent'}';">
                <img src="images/${wp.file}" 
                     alt="Обои ${wp.id}" 
                     style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    "
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#95a5a6;font-size:20px;\\'>${wp.id}</div>'">
                ${isActive ? '<div style="position:absolute;top:3px;right:3px;background:#268e96;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 8px rgba(38,142,150,0.4);">✓</div>' : ''}
            </button>
        `;
    });
    
    // Кнопка "Сбросить"
    const isDefault = !localStorage.getItem(WALLPAPER_KEY);
    panel.innerHTML += `
        </div>
        <button onclick="setWallpaper(null); closeWallpaperPanel();" 
                style="
                    margin-top: 12px;
                    padding: 10px;
                    border: 2px solid ${isDefault ? '#e74c3c' : '#e0e0e0'};
                    border-radius: 10px;
                    background: ${isDefault ? '#fde8e6' : '#f8f9fa'};
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-family: inherit;
                    color: #e74c3c;
                    flex-shrink: 0;
                "
                onmouseover="this.style.background='#fde8e6'; this.style.borderColor='#e74c3c';"
                onmouseout="this.style.background='${isDefault ? '#fde8e6' : '#f8f9fa'}'; this.style.borderColor='${isDefault ? '#e74c3c' : '#e0e0e0'}';">
                ${isDefault ? '✓ ' : ''}Стандартный фон
        </button>
    `;
    
    panel.innerHTML += `</div>`;
    
    document.body.appendChild(panel);
}

// ============================================
// 5. ЗАКРЫТЬ ПАНЕЛЬ
// ============================================
function closeWallpaperPanel() {
    const panel = document.getElementById('wallpaperPanel');
    if (panel) {
        panel.remove();
    }
}

// ============================================
// 6. ДОБАВИТЬ КНОПКУ (СВЕРХУ СПРАВА)
// ============================================
function addWallpaperButton() {
    if (document.getElementById('wallpaperBtn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'wallpaperBtn';
    btn.innerHTML = '🖼️';
    btn.title = 'Выбрать обои';
    btn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(8px);
        color: #2c3e50;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        transition: all 0.3s ease;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255,255,255,0.3);
    `;
    
    btn.onmouseover = function() {
        this.style.transform = 'scale(1.08)';
        this.style.boxShadow = '0 4px 20px rgba(38, 142, 150, 0.25)';
        this.style.background = 'rgba(38, 142, 150, 0.9)';
        this.style.color = 'white';
    };
    
    btn.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
        this.style.background = 'rgba(255, 255, 255, 0.85)';
        this.style.color = '#2c3e50';
    };
    
    btn.onclick = showWallpaperPanel;
    
    document.body.appendChild(btn);
    
    const saved = localStorage.getItem(WALLPAPER_KEY);
    updateButtonState(saved);
}

// ============================================
// 7. СТИЛИ
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #wallpaperPanel::-webkit-scrollbar {
        width: 4px;
    }
    
    #wallpaperPanel::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    #wallpaperPanel::-webkit-scrollbar-thumb {
        background: #268e96;
        border-radius: 10px;
    }
    
    #wallpaperPanel {
        animation: slideDown 0.3s ease;
    }
`;
document.head.appendChild(style);

// ============================================
// 8. ЗАКРЫТЬ ПРИ КЛИКЕ ВНЕ ПАНЕЛИ
// ============================================
document.addEventListener('click', function(event) {
    const panel = document.getElementById('wallpaperPanel');
    const btn = document.getElementById('wallpaperBtn');
    
    if (panel && btn) {
        const isClickInsidePanel = panel.contains(event.target);
        const isClickOnButton = btn.contains(event.target);
        
        if (!isClickInsidePanel && !isClickOnButton) {
            closeWallpaperPanel();
        }
    }
});

// ============================================
// 9. ЗАГРУЗКА
// ============================================
loadSavedWallpaper();
setTimeout(addWallpaperButton, 100);

window.addEventListener('pageshow', function() {
    loadSavedWallpaper();
    setTimeout(addWallpaperButton, 100);
});

console.log('🖼️ Wallpaper Manager загружен! (3 колонки, без подписей)');