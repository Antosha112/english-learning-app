// ============================================
// УПРАВЛЕНИЕ ОБОЯМИ И ЦВЕТАМИ (ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ)
// ============================================

const WALLPAPER_KEY = 'selected_wallpaper';
const COLOR_KEY = 'selected_bg_color';

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

const colors = [
    { id: 1, name: 'Белый', value: '#ffffff' },
    { id: 2, name: 'Небесный', value: '#87CEEB' },
    { id: 3, name: 'Лаванда', value: '#E6E6FA' },
    { id: 4, name: 'Персик', value: '#FFDAB9' },
    { id: 5, name: 'Мята', value: '#98FB98' },
    { id: 6, name: 'Розовый', value: '#FFB6C1' },
    { id: 7, name: 'Жёлтый', value: '#FFFACD' },
    { id: 8, name: 'Серый', value: '#D3D3D3' },
];

// -------- УСТАНОВИТЬ ФОН --------
function setBackground(imageFile, colorValue) {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';
    
    if (imageFile) {
        document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('images/${imageFile}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        localStorage.setItem(WALLPAPER_KEY, imageFile);
        localStorage.removeItem(COLOR_KEY);
    } else if (colorValue) {
        document.body.style.backgroundColor = colorValue;
        localStorage.setItem(COLOR_KEY, colorValue);
        localStorage.removeItem(WALLPAPER_KEY);
    } else {
        // По умолчанию белый фон
        document.body.style.backgroundColor = '#ffffff';
        localStorage.removeItem(WALLPAPER_KEY);
        localStorage.removeItem(COLOR_KEY);
    }
    updateButtonIcon();
}

// -------- ЗАГРУЗИТЬ СОХРАНЁННЫЙ --------
function loadSavedBackground() {
    const savedWallpaper = localStorage.getItem(WALLPAPER_KEY);
    const savedColor = localStorage.getItem(COLOR_KEY);
    if (savedWallpaper) setBackground(savedWallpaper, null);
    else if (savedColor) setBackground(null, savedColor);
    else document.body.style.backgroundColor = '#ffffff';
}

// -------- ОБНОВИТЬ ИКОНКУ КНОПКИ --------
function updateButtonIcon() {
    const btn = document.getElementById('wallpaperBtn');
    if (!btn) return;
    const hasWallpaper = localStorage.getItem(WALLPAPER_KEY);
    const hasColor = localStorage.getItem(COLOR_KEY);
    btn.innerHTML = (hasWallpaper || hasColor) ? '🖼️' : '🎨';
}

// -------- ПОКАЗАТЬ ПАНЕЛЬ --------
function showWallpaperPanel() {
    let panel = document.getElementById('wallpaperPanel');
    if (panel) { 
        panel.remove(); 
        return; 
    }
    
    const currentWallpaper = localStorage.getItem(WALLPAPER_KEY);
    const currentColor = localStorage.getItem(COLOR_KEY);
    const isDefault = !currentWallpaper && !currentColor;
    
    panel = document.createElement('div');
    panel.id = 'wallpaperPanel';
    panel.style.cssText = `
        position: fixed; 
        top: 80px; 
        right: 20px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 340px;
        width: 90%;
        max-height: 80vh;
        border: 1px solid rgba(255,255,255,0.3);
        overflow-y: auto;
    `;
    
    // Адаптив для мобильных
    if (window.innerWidth <= 480) {
        panel.style.top = '70px';
        panel.style.right = '10px';
        panel.style.maxWidth = '95%';
        panel.style.padding = '15px';
    }
    
    // СОБИРАЕМ HTML В ОДНУ СТРОКУ (ЧТОБЫ ИЗБЕЖАТЬ КАШИ)
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h4 style="margin:0; color:#2c3e50; font-weight:normal; font-size:16px;">Выбрать фон</h4>
            <button onclick="closePanel()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#95a5a6; padding:0 5px;">×</button>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:15px;">
            <button id="tabWallpapersBtn" style="flex:1; padding:8px; border:2px solid #268e96; border-radius:20px; background:#268e96; color:white; cursor:pointer; font-family:inherit; font-size:13px;">🖼️ Обои</button>
            <button id="tabColorsBtn" style="flex:1; padding:8px; border:2px solid #268e96; border-radius:20px; background:white; color:#2c3e50; cursor:pointer; font-family:inherit; font-size:13px;">🎨 Цвета</button>
        </div>
        
        <!-- Сетка обоев -->
        <div id="wallpapersGrid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; max-height:300px; overflow-y:auto; padding-right:5px;">
    `;
    
    // Добавляем обои в общую строку
    wallpapers.forEach(wp => {
        const active = currentWallpaper === wp.file;
        html += `
            <button onclick="setBackground('${wp.file}', null); closePanel();" style="position:relative; padding:0; border:3px solid ${active ? '#268e96' : 'transparent'}; border-radius:8px; cursor:pointer; overflow:hidden; aspect-ratio:1/1; background:#e0e0e0;">
                <img src="images/${wp.file}" style="width:100%; height:100%; object-fit:cover; display:block;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#95a5a6;font-size:20px;\\'>${wp.id}</div>'">
                ${active ? '<div style="position:absolute;top:3px;right:3px;background:#268e96;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;">✓</div>' : ''}
            </button>
        `;
    });
    
    // Закрываем сетку обоев и открываем сетку цветов
    html += `
        </div>
        
        <!-- Сетка цветов (изначально скрыта) -->
        <div id="colorsGrid" style="display:none; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; max-height:300px; overflow-y:auto; padding-right:5px;">
    `;
    
    // Добавляем цвета в общую строку
    colors.forEach(color => {
        const active = currentColor === color.value;
        const textColor = isLightColor(color.value) ? '#2c3e50' : 'white';
        html += `
            <button onclick="setBackground(null, '${color.value}'); closePanel();" 
                    style="position:relative; 
                           padding:8px; 
                           border:3px solid ${active ? '#268e96' : 'transparent'}; 
                           border-radius:8px; 
                           cursor:pointer; 
                           aspect-ratio:1/1; 
                           background:${color.value}; 
                           display:flex; 
                           flex-direction:column;
                           align-items:center; 
                           justify-content:center; 
                           font-size:12px; 
                           color:${textColor}; 
                           font-weight:bold;">
                ${active ? '<span style="position:absolute;top:3px;right:3px;background:#268e96;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;">✓</span>' : ''}
                <span style="font-size:11px; font-weight:normal; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">${color.name}</span>
            </button>
        `;
    });
    
    // Закрываем сетку цветов и добавляем нижнюю общую кнопку сброса
    html += `
        </div>
        <button onclick="setBackground(null, null); closePanel();" style="margin-top:12px; padding:10px; width:100%; border:2px solid ${isDefault ? '#268e96' : '#e0e0e0'}; border-radius:10px; background:${isDefault ? '#e8f5e9' : '#f8f9fa'}; cursor:pointer; color:#268e96; font-family:inherit; font-size:14px; transition:all 0.3s;">
            ${isDefault ? '✓ ' : ''}По умолчанию
        </button>
    `;
    
    // И только теперь один раз вставляем весь собранный HTML в панель
    panel.innerHTML = html;
    document.body.appendChild(panel);
    
    // -------- ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК --------
    const tabWallpapers = document.getElementById('tabWallpapersBtn');
    const tabColors = document.getElementById('tabColorsBtn');
    const wallpapersGrid = document.getElementById('wallpapersGrid');
    const colorsGrid = document.getElementById('colorsGrid');
    
    function switchToWallpapers() {
        wallpapersGrid.style.display = 'grid';
        colorsGrid.style.display = 'none';
        tabWallpapers.style.background = '#268e96';
        tabWallpapers.style.color = 'white';
        tabColors.style.background = 'white';
        tabColors.style.color = '#2c3e50';
    }
    
    function switchToColors() {
        wallpapersGrid.style.display = 'none';
        colorsGrid.style.display = 'grid';
        tabColors.style.background = '#268e96';
        tabColors.style.color = 'white';
        tabWallpapers.style.background = 'white';
        tabWallpapers.style.color = '#2c3e50';
    }
    
    if (tabWallpapers && tabColors && wallpapersGrid && colorsGrid) {
        tabWallpapers.onclick = switchToWallpapers;
        tabColors.onclick = switchToColors;
    }
    
    updateButtonIcon();
}

// -------- ЗАКРЫТЬ ПАНЕЛЬ --------
function closePanel() {
    const panel = document.getElementById('wallpaperPanel');
    if (panel) panel.remove();
}

// -------- ОПРЕДЕЛЕНИЕ СВЕТЛОГО ЦВЕТА --------
function isLightColor(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// -------- ДОБАВИТЬ КНОПКУ --------
function addWallpaperButton() {
    if (document.getElementById('wallpaperBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'wallpaperBtn';
    btn.innerHTML = '🎨';
    btn.title = 'Выбрать фон';
    btn.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        width: 44px; height: 44px;
        border-radius: 50%; border: none;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(8px);
        color: #2c3e50; font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        z-index: 999;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease;
    `;
    
    // Адаптив для мобильных
    if (window.innerWidth <= 480) {
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.width = '38px';
        btn.style.height = '38px';
        btn.style.fontSize = '16px';
    }
    
    btn.onmouseover = function() {
        this.style.transform = 'scale(1.08)';
        this.style.background = 'rgba(38,142,150,0.9)';
        this.style.color = 'white';
    };
    btn.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'rgba(255,255,255,0.85)';
        this.style.color = '#2c3e50';
    };
    btn.onclick = showWallpaperPanel;
    document.body.appendChild(btn);
    updateButtonIcon();
}

// -------- ЗАКРЫТЬ ПРИ КЛИКЕ ВНЕ --------
document.addEventListener('click', function(e) {
    const panel = document.getElementById('wallpaperPanel');
    const btn = document.getElementById('wallpaperBtn');
    if (panel && btn) {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            closePanel();
        }
    }
});

// -------- ЗАПУСК --------
loadSavedBackground();
setTimeout(addWallpaperButton, 100);
window.addEventListener('pageshow', function() {
    loadSavedBackground();
    setTimeout(addWallpaperButton, 100);
});
