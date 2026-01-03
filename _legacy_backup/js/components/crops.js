import Nonsaro from '../api/nonsaro.js';

export default {
    async render() {
        const container = document.createElement('div');
        
        container.innerHTML = `
            <div class="card">
                <h3>🌱 작물 재배 계획</h3>
                <p>농진청 '농사로' 데이터를 기반으로 추천 일정을 불러옵니다.</p>
                
                <div class="search-box" style="margin: 20px 0;">
                    <input type="text" id="cropSearch" placeholder="작물 검색 (예: 벼, 고추)...">
                    <button id="btnSearch">검색</button>
                </div>

                <div id="searchResults"></div>
            </div>
        `;

        return container;
    },

    afterRender() {
        const btn = document.getElementById('btnSearch');
        const input = document.getElementById('cropSearch');
        const results = document.getElementById('searchResults');

        btn.addEventListener('click', async () => {
            const query = input.value;
            if(!query) return;

            results.innerHTML = '검색중...';
            
            try {
                // Mocking API call for now until Nonsaro.js is fully implemented
                // const data = await Nonsaro.searchCrop(query);
                
                // Temporary Mock
                setTimeout(() => {
                    results.innerHTML = `
                        <div class="result-item" style="border:1px solid #ddd; padding:10px; margin-top:10px;">
                            <strong>${query}</strong> (예시 결과)
                            <button onclick="alert('선택 기능 준비중')">선택</button>
                        </div>
                    `;
                }, 500);

            } catch(e) {
                results.innerHTML = '오류 발생: ' + e.message;
            }
        });
    }
};
