// 1. Veri Tanımlamaları: 7 günlük ve 30 günlük veri setleri
const data7 = [25000, 31000, 24000, 35000, 29000, 42000, 38000];
const labels7 = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const data30 = [85000, 45000, 95000, 60000, 110000, 75000, 130000];
const labels30 = ['H-1', 'H-2', 'H-3', 'H-4', 'H-5', 'H-6', 'H-7'];

let myChart = null; // Aktif grafik nesnesi

/**
 * Grafiği baştan çizen fonksiyon (Animasyonsuz, stabil çalışma sağlar)
 */
function renderGraph(period) {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    // Önceki grafik nesnesini temizle (Bellek yönetimi için kritik)
    if (myChart !== null) {
        myChart.destroy();
    }

    const ctx = canvas.getContext('2d');

    // Gradient (Dolgu rengi) ayarları
    const grad = ctx.createLinearGradient(0, 0, 0, 350);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    grad.addColorStop(1, 'transparent');

    const currentLabels = (period === "30") ? labels30 : labels7;
    const currentData = (period === "30") ? data30 : data7;

    // Yeni Chart.js örneği oluştur
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: currentLabels,
            datasets: [{
                data: currentData,
                borderColor: '#6366f1',
                borderWidth: 4,
                backgroundColor: grad,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Hızlı ve kararlı geçiş için animasyon kapalı
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

// Sayfa yüklendiğinde çalışacak ana olaylar
document.addEventListener('DOMContentLoaded', () => {
    // 1. İlk açılışta grafiği çiz
    renderGraph("7");

    // 2. Select kutusu değişikliğini dinle
    const select = document.getElementById('periodSelect');
    if (select) {
        select.addEventListener('change', (e) => {
            renderGraph(e.target.value);
        });
    }

    // 3. İstatistik Sayaçlarını Başlat
    document.querySelectorAll('.counter').forEach(c => {
        const target = +c.dataset.target;
        let count = 0;
        const inc = target / 30;
        const tick = () => {
            if (count < target) {
                count += inc;
                c.innerText = Math.ceil(count).toLocaleString('tr-TR');
                setTimeout(tick, 20);
            } else { c.innerText = target.toLocaleString('tr-TR'); }
        };
        tick();
    });

    // 4. Canlı Saat Fonksiyonu
    setInterval(() => {
        const clock = document.getElementById('liveClock');
        if (clock) clock.innerText = new Date().toLocaleString('tr-TR');
    }, 1000);
});