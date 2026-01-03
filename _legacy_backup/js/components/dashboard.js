import PublicData from '../api/publicData.js';

export default {
    async render() {
        const container = document.createElement('div');
        container.className = 'dashboard-container';

        // 데이터 로딩 (병렬 처리)
        const [weather, prices] = await Promise.all([
            PublicData.getWeather(60, 127), // 기본 좌표 (서울)
            PublicData.getMarketPrices()
        ]);

        // 1. Weather Widget
        const weatherHtml = `
            <div class="card weather-widget">
                <h3>🌤️ 오늘의 날씨</h3>
                <div class="weather-info">
                    <p>위치: <span>${weather.location}</span></p>
                    <p class="temp">${weather.temperature}°C</p>
                    <p class="desc">${weather.sky}</p>
                </div>
            </div>
        `;

        // 2. Market Price Widget
        const priceListHtml = prices.map(p => `
            <li>
                ${p.name}: ${p.price}원 
                <span class="${p.isUp ? 'trend-up' : 'trend-down'}" style="color: ${p.isUp ? 'red' : 'blue'}">
                    ${p.change}
                </span>
            </li>
        `).join('');

        const marketHtml = `
            <div class="card market-widget">
                <h3>💰 주요 농산물 시세</h3>
                <ul>${priceListHtml}</ul>
            </div>
        `;

        // 3. Todo List
        const todoHtml = `
            <div class="card todo-widget">
                <h3>✅ 오늘의 할 일</h3>
                <ul class="todo-list">
                    <li><input type="checkbox"> A-1 구역 물주기</li>
                    <li><input type="checkbox"> 비료 구매하기</li>
                </ul>
            </div>
        `;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                ${weatherHtml}
                ${marketHtml}
            </div>
            ${todoHtml}
        `;

        return container;
    },

    afterRender() {
        // Here we will hook up API calls later
        console.log('Dashboard rendered');
    }
};
