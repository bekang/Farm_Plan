export default {
    async render() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="card map-editor-container">
                <div class="map-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>🎨 내 농장 그리기</h3>
                    <div class="tools">
                        <button class="btn-tool active" data-type="field">밭 (갈색)</button>
                        <button class="btn-tool" data-type="water">수로 (파랑)</button>
                        <button class="btn-tool" data-type="road">길 (회색)</button>
                        <button class="btn-tool" data-type="building">창고 (빨강)</button>
                        <button class="btn-save btn-primary">저장하기</button>
                    </div>
                </div>
                <canvas id="farmCanvas" width="800" height="600" style="border: 2px dashed #8bc34a; background-color: #f1f8e9; cursor: crosshair;"></canvas>
                <p class="hint">마우스로 드래그하여 농장을 꾸며보세요. (현재는 단순 그리기만 가능)</p>
            </div>
        `;
        return container;
    },

    afterRender() {
        const canvas = document.getElementById('farmCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentType = 'field';
        
        // Colors mapping
        const colors = {
            field: 'rgba(121, 85, 72, 0.5)', // Brown
            water: 'rgba(33, 150, 243, 0.5)', // Blue
            road: 'rgba(158, 158, 158, 0.5)',  // Grey
            building: 'rgba(244, 67, 54, 0.5)' // Red
        };

        // Tool selection
        const buttons = document.querySelectorAll('.btn-tool');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentType = btn.dataset.type;
            });
        });

        // Drawing Logic (Simple Grid-like)
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            draw(e);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) draw(e);
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });

        function draw(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Snap to grid (20px)
            const gridSize = 20;
            const gridX = Math.floor(x / gridSize) * gridSize;
            const gridY = Math.floor(y / gridSize) * gridSize;

            ctx.fillStyle = colors[currentType];
            ctx.fillRect(gridX, gridY, gridSize, gridSize);
        }

        // Load saved image if exists
        const savedMap = localStorage.getItem('farm_map_image');
        if (savedMap) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedMap;
        }

        // Save functionality
        document.querySelector('.btn-save').addEventListener('click', () => {
            const dataURL = canvas.toDataURL();
            localStorage.setItem('farm_map_image', dataURL);
            alert('나만의 농장 지도가 저장되었습니다! 대시보드에서 확인해보세요.');
        });
    }
};
