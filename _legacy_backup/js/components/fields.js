import { FarmService } from '../services/farmService.js';

export default {
    async render() {
        const farmService = new FarmService();
        const fields = farmService.getFields();

        const container = document.createElement('div');
        
        const listHtml = fields.map((f, index) => `
            <div class="card field-item" style="cursor: pointer;" onclick="window.location.hash = '/field-detail?id=${f.id}'">
                <div class="field-header">
                    <h4>${f.name}</h4>
                    <span class="badge">${f.crop || '작물 미정'}</span>
                </div>
                <div class="field-detail">
                    <p>면적: ${f.area}평</p>
                    <p>위치: ${f.location}</p>
                </div>
                <!-- 
                <div class="field-actions">
                     <button onclick="event.stopPropagation(); alert('수정 기능 준비중')">수정</button>
                     <button onclick="event.stopPropagation(); window.deleteField(${index})">삭제</button>
                </div>
                -->
            </div>
        `).join('') || '<p>등록된 농지가 없습니다.</p>';

        container.innerHTML = `
            <div class="card add-field-form">
                <h3>➕ 새 농지 등록</h3>
                <form id="fieldForm" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <input type="text" id="fieldName" placeholder="농지 이름 (예: 뒷산 밭)" required>
                    <input type="number" id="fieldArea" placeholder="면적 (평)" required>
                    <input type="text" id="fieldLocation" placeholder="위치 (주소)" required>
                    <button type="submit" class="btn-primary">등록</button>
                </form>
            </div>
            
            <div class="fields-list">
                <h3>📋 내 농지 목록</h3>
                <div class="list-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                    ${listHtml}
                </div>
            </div>
        `;

        return container;
    },

    afterRender() {
        const farmService = new FarmService();
        const form = document.getElementById('fieldForm');
        
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('fieldName').value;
                const area = document.getElementById('fieldArea').value;
                const location = document.getElementById('fieldLocation').value;

                // Field Schema according to ERD
                const newField = { 
                    name, 
                    area: Number(area), 
                    location, 
                    crop: null, // Initial crop is null
                    created_at: new Date().toISOString()
                };
                
                farmService.addField(newField);

                alert('농지가 등록되었습니다.');
                // Refresh page
                window.location.reload(); 
            });
        }
    }
};
