// ============================================
// МЕНЕДЖЕР ДАННЫХ (ИМПОРТ / ЭКСПОРТ JSON)
// ============================================

(function() {
    // Все ключи localStorage
    const STORAGE_KEYS = {
        lexis: 'english_lexis',
        grammar: 'english_grammar',
        tenses: 'english_tenses',
        songs: 'english_songs',
        videos: 'english_videos',
        phonetics: 'english_phonetics'
    };

    // Получить все данные
    function getAllData() {
        const data = {};
        for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
            try {
                const raw = localStorage.getItem(storageKey);
                data[key] = raw ? JSON.parse(raw) : [];
            } catch {
                data[key] = [];
            }
        }
        return data;
    }

    // Импортировать данные (заменяет всё)
    function importAllData(data) {
        const required = Object.keys(STORAGE_KEYS);
        const isValid = required.every(key => key in data && Array.isArray(data[key]));
        if (!isValid) {
            alert('❌ Неверный формат JSON. Ожидаются ключи: ' + required.join(', '));
            return false;
        }

        const total = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
        if (!confirm(`Импортировать ${total} записей? Текущие данные будут заменены.`)) {
            return false;
        }

        for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
            localStorage.setItem(storageKey, JSON.stringify(data[key]));
        }

        alert('✅ Импорт завершён!');
        location.reload(); // Обновить страницу
        return true;
    }

    // Экспортировать данные
    function exportData() {
        const data = getAllData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `english_backup_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== СОЗДАНИЕ КНОПКИ И ПОПАПА =====
    function createUI() {
        // Кнопка
        const btn = document.createElement('button');
        btn.innerHTML = '💾';
        btn.title = 'Управление данными (импорт/экспорт)';
        btn.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: none;
            background: #268e96;
            color: white;
            font-size: 22px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(38, 142, 150, 0.4);
            z-index: 9999;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
        btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };

        // Попап (изначально скрыт)
        const popup = document.createElement('div');
        popup.id = 'dataManagerPopup';
        popup.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 24px;
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 260px;
            display: none;
            font-family: inherit;
        `;
        popup.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h4 style="margin:0; color:#2c3e50; font-weight:normal; font-size:18px;">📦 Данные</h4>
                <button onclick="this.closest('#dataManagerPopup').style.display='none'" 
                        style="background:none; border:none; font-size:24px; cursor:pointer; color:#95a5a6;">×</button>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button id="exportDataBtn" style="padding:10px; border:2px solid #268e96; border-radius:10px; background:white; color:#268e96; cursor:pointer; font-size:15px; font-family:inherit;">
                    ⬇️ Экспорт JSON
                </button>
                <button id="importDataBtn" style="padding:10px; border:2px solid #268e96; border-radius:10px; background:#268e96; color:white; cursor:pointer; font-size:15px; font-family:inherit;">
                    ⬆️ Импорт JSON
                </button>
                <input type="file" id="fileInput" accept=".json" style="display:none;">
                <div style="font-size:12px; color:#95a5a6; text-align:center; margin-top:4px;">
                    Все данные: лексика, грамматика, времена, песни, видео, фонетика
                </div>
            </div>
        `;

        document.body.appendChild(btn);
        document.body.appendChild(popup);

        // Открыть/закрыть попап
        btn.onclick = function(e) {
            e.stopPropagation();
            const isOpen = popup.style.display === 'block';
            popup.style.display = isOpen ? 'none' : 'block';
        };

        // Закрыть при клике вне
        document.addEventListener('click', function(e) {
            if (!popup.contains(e.target) && e.target !== btn) {
                popup.style.display = 'none';
            }
        });

        // Экспорт
        document.getElementById('exportDataBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            exportData();
            popup.style.display = 'none';
        });

        // Импорт (открыть диалог выбора файла)
        document.getElementById('importDataBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('fileInput').click();
        });

        // Обработка файла
        document.getElementById('fileInput').addEventListener('change', function(e) {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                try {
                    const data = JSON.parse(ev.target.result);
                    importAllData(data);
                } catch (err) {
                    alert('❌ Ошибка чтения файла: ' + err.message);
                }
            };
            reader.readAsText(file);
            this.value = ''; // Сброс
            popup.style.display = 'none';
        });
    }

    // Запуск после загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();