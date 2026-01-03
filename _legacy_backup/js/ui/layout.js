import { Component } from '../core/component.js';

export class Layout extends Component {
    render() {
        this.element.innerHTML = `
            <div class="app-container">
                <nav class="sidebar">
                    <div class="brand">
                        <h1>꿈을 그리는<br>농장</h1>
                    </div>
                    <ul class="nav-links">
                        <li data-path="/dashboard" class="active">
                            <span>📊</span> 대시보드
                        </li>
                        <li data-path="/fields">
                            <span>🌱</span> 농장 관리
                        </li>
                        <li data-path="/schedule">
                            <span>📅</span> 일정 관리
                        </li>
                        <li data-path="/settings">
                            <span>⚙️</span> 설정
                        </li>
                    </ul>
                </nav>
                <main class="main-content">
                    <header class="top-bar">
                        <h2 id="page-title">대시보드</h2>
                        <div class="user-profile">
                            <span>Guest 님</span>
                        </div>
                    </header>
                    <div id="content-area">
                        <!-- Pages will be mounted here -->
                    </div>
                </main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const navItems = this.element.querySelectorAll('.nav-links li');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                window.location.hash = path;
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    /**
     * Updates the page title in the header
     * @param {string} title 
     */
    setTitle(title) {
        const titleEl = this.element.querySelector('#page-title');
        if(titleEl) titleEl.textContent = title;
    }
}
