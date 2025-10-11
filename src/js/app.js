// === Получаем курс валют ===
async function fetchRate(base = "USD", target = "RUB") {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", { cache: "no-cache" });
  const data = await response.json();
  const rates = data.Valute;

  let rate;

  // если одна из валют — рубль
  if (base === "RUB") {
    // курс RUB → любая
    rate = 1 / rates[target].Value;
  } else if (target === "RUB") {
    // курс любая → RUB
    rate = rates[base].Value;
  } else {
    // курс любая → любая (через рубль)
    rate = rates[base].Value / rates[target].Value;
  }

  // 💬 Показываем курс на странице
  document.querySelector(".rate").textContent = rate.toFixed(2);

  // 🕒 Обновляем время
  document.getElementById("update-time").textContent = new Date().toLocaleTimeString();
  document.getElementById("next-time").textContent = "00:10";

  // 🔁 Обновляем надпись "USD:RUB" / "RUB:EUR"
  document.getElementById("currency-name").textContent = `${base}:${target}`;

  return rate;
}

// === Настройки графика ===
let chart;
let currentCurrency = "USD";

// функция для рисования графика
async function drawChart(base = "USD", target = "RUB") {
  const ctx = document.getElementById("currencyChart").getContext("2d");

  // примерные даты (фиктивные)
  const labels = ["12.09", "19.09", "26.09", "03.10", "11.10"];
  const rates = [82.5, 83.1, 83.4, 83.0, await fetchRate(base, target)];

  if (chart) {
    chart.data.datasets[0].data = rates;
    chart.update();
    return;
  }

  // создаем график
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        data: rates,
        borderColor: "#4e7097",
        backgroundColor: "rgba(78,112,151,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `Курс: ${context.parsed.y.toFixed(2)}`
          }
        }
      },
      interaction: {
        intersect: false,
        mode: "index"
      },
      scales: {
        y: { display: false, grid: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

// === Управление кнопками ===
function setActiveButton(id) {
  document.querySelectorAll(".btn-rate").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// === Слушатели кнопок ===
document.getElementById("btn-usd").addEventListener("click", () => {
  currentCurrency = "USD";
  setActiveButton("btn-usd");
  drawChart("USD", "RUB");
});

document.getElementById("btn-rub").addEventListener("click", () => {
  currentCurrency = "RUB";
  setActiveButton("btn-rub");
  drawChart("RUB", "EUR");
});

document.getElementById("btn-kzt").addEventListener("click", () => {
  currentCurrency = "KZT";
  setActiveButton("btn-kzt");
  drawChart("KZT", "RUB");
});

document.getElementById("btn-uah").addEventListener("click", () => {
  currentCurrency = "UAH";
  setActiveButton("btn-uah");
  drawChart("UAH", "RUB");
});

// === При загрузке страницы ===
window.addEventListener("DOMContentLoaded", () => {
  drawChart("USD", "RUB");
  setActiveButton("btn-usd");
});

// === Автообновление каждые 5 минут ===
setInterval(async () => {
  await drawChart(currentCurrency === "RUB" ? "RUB" : currentCurrency, "RUB");
  console.log("График обновлён:", new Date().toLocaleTimeString());
}, 300000);
// end