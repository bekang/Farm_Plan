import { Component } from '../core/component.js';
import PublicData from '../api/publicData.js';
import { QnaService } from '../services/qnaService.js';

export class Dashboard extends Component {
    constructor() {
        super();
        this.qnaService = new QnaService();
    }

    async render() {
        this.element.innerHTML = `
            <div class="dashboard">
                <div class="welcome-section">
                    <h1>안녕하세요, 농부님! 👋</h1>
                    <p>오늘도 풍성한 수확을 꿈꿔보세요.</p>
                </div>

                <!-- Q&A Section -->
                <div class="card qna-section">
                    <h3>🤖 농부의 비서</h3>
                    <div id="chat-display" class="chat-box" style="display: none; height: 300px; overflow-y: auto; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <div class="chat-msg system">무엇을 도와드릴까요?</div>
                    </div>
                    
                    <div class="qna-input-area" style="display: flex; gap: 10px;">
                        <input type="text" id="qna-input" placeholder="예: 내 고추밭 비료 얼마나 줘야 해?" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="qna-btn" class="btn-primary">질문하기</button>
                    </div>

                    <div class="qna-chips" style="margin-top: 10px; display: flex; gap: 8px;">
                        <span class="chip" onclick="document.getElementById('qna-input').value='내 고추밭 비료 추천해줘'; document.getElementById('qna-btn').click();">💊 비료 추천</span>
                        <span class="chip" onclick="document.getElementById('qna-input').value='전체 농장 상태 보여줘'; document.getElementById('qna-btn').click();">🏡 농장 상태</span>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Weather Widget -->
                    <div class="card weather-card">
                        <h3>🌤️ 오늘의 날씨</h3>
                        <div id="weather-content" class="loading-spinner">
                            날씨 정보를 불러오는 중입니다...
                        </div>
                    </div>

                    <!-- Market Price Widget -->
                    <div class="card price-card">
                        <h3>📈 농산물 시세</h3>
                        <div id="price-content" class="loading-spinner">
                            시세 정보를 불러오는 중입니다...
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize Components
        this.setupQna();
        this.loadWeatherData();
        this.loadMarketData();
    }

    setupQna() {
        const input = this.element.querySelector('#qna-input');
        const btn = this.element.querySelector('#qna-btn');
        const display = this.element.querySelector('#chat-display');

        const ask = async () => {
             const question = input.value.trim();
             if (!question) return;

             // Show User Message
             display.style.display = 'block';
             display.innerHTML += `<div class="chat-msg user" style="text-align: right; margin: 10px 0; color: #2c3e50; font-weight: bold;">Q. ${question}</div>`;
             
             // Scroll to bottom
             display.scrollTop = display.scrollHeight;
             
             input.value = ''; // clear

             // Get Answer
             display.innerHTML += `<div class="chat-msg system loading" style="color: #666;">답변을 생각하는 중...</div>`;
             
             const response = await this.qnaService.ask(question);
             
             // Remove loading
             display.querySelector('.loading').remove();

             // Show System Message
             display.innerHTML += `<div class="chat-msg system" style="text-align: left; background: #e8f5e9; padding: 10px; border-radius: 8px; margin: 5px 0;">${response.text}</div>`;
             display.scrollTop = display.scrollHeight;
        };

        btn.addEventListener('click', ask);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') ask();
        });
    }

    async loadWeatherData() {
        const weatherEl = this.element.querySelector('#weather-content');
        try {
            // Mock Location (Seoul)
            const weather = await PublicData.getWeather(60, 127);
            weatherEl.innerHTML = `
                <div class="weather-display">
                    <div class="temperature">${weather.temperature}°C</div>
                    <div class="details">
                        <span>${weather.sky}</span>
                        <span>강수확률 ${weather.rain}%</span>
                    </div>
                    <div class="location">📍 ${weather.location}</div>
                </div>
            `;
        } catch (e) {
            weatherEl.innerHTML = `<p class="error">날씨 정보를 가져올 수 없습니다.</p>`;
        }
    }

    async loadMarketData() {
        const priceEl = this.element.querySelector('#price-content');
        try {
            const prices = await PublicData.getMarketPrices();
            const listHtml = prices.map(item => `
                <div class="price-item">
                    <span class="crop-name">${item.name}</span>
                    <span class="price-value">${item.price}원</span>
                    <span class="price-change ${item.isUp ? 'up' : 'down'}">${item.change}</span>
                </div>
            `).join('');
            
            priceEl.innerHTML = `<div class="price-list">${listHtml}</div>`;
        } catch (e) {
            priceEl.innerHTML = `<p class="error">시세 정보를 가져올 수 없습니다.</p>`;
        }
    }
}
