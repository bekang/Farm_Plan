import { FarmService } from '../services/farmService.js';

export default {
    async render() {
        const farmService = new FarmService();
         // Parse ID from URL query: /field-detail?id=123
         const rawHash = window.location.hash.slice(1); // /field-detail?id=123
         const queryPart = rawHash.split('?')[1];
         const params = new URLSearchParams(queryPart);
         const fieldId = params.get('id');

         if(!fieldId) return `<h3>잘못된 접근입니다.</h3>`;

         const field = farmService.getField(fieldId);
         if(!field) return `<h3>농지 정보를 찾을 수 없습니다.</h3>`;

         // Load previous tests
         const soilTests = farmService.getSoilTests(fieldId);
         const waterTests = farmService.getWaterTests(fieldId);

         const container = document.createElement('div');
         
         container.innerHTML = `
            <div class="field-detail-header">
                <button onclick="window.history.back()" class="btn-secondary">⬅ 뒤로가기</button>
                <h2>${field.name} 상세 정보</h2>
            </div>
            
            <div class="card">
                <h3>🌾 기본 정보</h3>
                <div class="info-grid">
                    <p><strong>작물:</strong> ${field.crop || '미정'}</p>
                    <p><strong>면적:</strong> ${field.area}평</p>
                    <p><strong>위치:</strong> ${field.location}</p>
                </div>
            </div>

            <div class="tabs">
                <button class="tab-btn active" onclick="window.switchTab('soil')">토양 검사</button>
                <button class="tab-btn" onclick="window.switchTab('water')">수질 검사</button>
            </div>

            <!-- Soil Test Section -->
            <div id="soil-section" class="tab-content active">
                <div class="card">
                    <h3>🧪 토양 검정 결과 추가</h3>
                    <form id="soilForm" class="test-form">
                        <div class="form-row">
                            <label>검사일자: <input type="date" name="test_date" required></label>
                        </div>
                        <div class="form-grid">
                            <label>산도(pH): <input type="number" step="0.1" name="ph" required></label>
                            <label>유기물(OM): <input type="number" step="1" name="om" required> g/kg</label>
                            <label>유효인산(P2O5): <input type="number" step="1" name="p2o5" required> mg/kg</label>
                            <label>칼륨(K): <input type="number" step="0.01" name="k" required> cmol+/kg</label>
                            <label>칼슘(Ca): <input type="number" step="0.1" name="ca"> cmol+/kg</label>
                            <label>마그네슘(Mg): <input type="number" step="0.1" name="mg"> cmol+/kg</label>
                            <label>전기전도도(EC): <input type="number" step="0.1" name="ec"> dS/m</label>
                        </div>
                        <button type="submit" class="btn-primary" style="margin-top: 10px;">저장</button>
                    </form>
                </div>
                
                <div class="history-list">
                    <h4>이전 검사 이력</h4>
                    <ul>
                        ${soilTests.map(t => `<li>${t.test_date}: pH ${t.ph}, OM ${t.om}%</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- Water Test Section -->
            <div id="water-section" class="tab-content" style="display: none;">
                <div class="card">
                    <h3>💧 수질 검사 결과 추가</h3>
                    <form id="waterForm" class="test-form">
                        <div class="form-row">
                            <label>검사일자: <input type="date" name="test_date" required></label>
                        </div>
                        <!-- Basic -->
                        <h4>기본 항목</h4>
                        <div class="form-grid">
                           <label>pH: <input type="number" step="0.1" name="ph" required></label>
                           <label>EC: <input type="number" step="0.1" name="ec" required> dS/m</label>
                           <label>질산태질소(NO3-N): <input type="number" step="0.1" name="no3_n"> mg/L</label>
                           <label>암모니아태질소(NH4-N): <input type="number" step="0.1" name="nh4_n"> mg/L</label>
                        </div>
                        
                        <!-- Advanced Toggle -->
                        <details>
                            <summary style="margin: 10px 0; cursor: pointer;">🔽 상세 미량요소 펼치기</summary>
                            <div class="form-grid">
                                <label>인(P): <input type="number" step="0.01" name="p"></label>
                                <label>칼륨(K): <input type="number" step="0.01" name="k"></label>
                                <label>칼슘(Ca): <input type="number" step="0.01" name="ca"></label>
                                <label>마그네슘(Mg): <input type="number" step="0.01" name="mg"></label>
                                <label>황(S): <input type="number" step="0.01" name="s"></label>
                                <label>철(Fe): <input type="number" step="0.001" name="fe"></label>
                                <label>망간(Mn): <input type="number" step="0.001" name="mn"></label>
                                <!-- More fields can be added -->
                            </div>
                        </details>

                        <button type="submit" class="btn-primary" style="margin-top: 10px;">저장</button>
                    </form>
                </div>

                 <div class="history-list">
                    <h4>이전 검사 이력</h4>
                    <ul>
                        ${waterTests.map(t => `<li>${t.test_date}: pH ${t.ph}, EC ${t.ec}</li>`).join('')}
                    </ul>
                </div>
            </div>
         `;
         
         return container;
    },

    afterRender() {
        // Tab Switching Logic
        window.switchTab = (tabName) => {
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            
            document.getElementById(`${tabName}-section`).style.display = 'block';
            // Find button roughly..
            const btns = document.querySelectorAll('.tab-btn');
            if(tabName === 'soil') btns[0].classList.add('active');
            else btns[1].classList.add('active');
        };

        const farmService = new FarmService();
        const rawHash = window.location.hash.slice(1);
        const params = new URLSearchParams(rawHash.split('?')[1]);
        const fieldId = params.get('id');

        // Soil Form Handler
        const soilForm = document.getElementById('soilForm');
        if(soilForm) {
            soilForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                
                // Convert numbers
                for(let key in data) {
                    if(key !== 'test_date') data[key] = parseFloat(data[key]) || 0;
                }

                farmService.saveSoilTest(fieldId, data);
                alert('토양 검사 결과가 저장되었습니다.');
                window.location.reload();
            });
        }

        // Water Form Handler
        const waterForm = document.getElementById('waterForm');
        if(waterForm) {
            waterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());

                 // Convert numbers
                 for(let key in data) {
                    if(key !== 'test_date') data[key] = parseFloat(data[key]) || 0;
                }

                farmService.saveWaterTest(fieldId, data);
                alert('수질 검사 결과가 저장되었습니다.');
                window.location.reload();
            });
        }
    }
}
