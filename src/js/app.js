// === Получаем курс валют ===
async function fetchRate(base = "USD", target = "RUB") {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", { cache: "no-cache" });
  const data = await response.json();
  const rates = data.Valute;

  let rate;

  // если одна из валют — рубль
  if (base === "RUB") {
    // курс RUB → любая
    rate = 1 / (rates[target].Value / rates[target].Nominal);
  } else if (target === "RUB") {
    // курс любая → RUB
    rate = rates[base].Value / rates[base].Nominal;
  } else {
    // курс любая → любая (через рубль)
    rate = (rates[base].Value / rates[base].Nominal) / (rates[target].Value / rates[target].Nominal);
  }

  // 💬 Показываем курс на странице
  document.querySelector(".rate").textContent = rate.toFixed(2);

  // 🕒 Обновляем время
  document.getElementById("update-time").textContent = new Date().toLocaleTimeString();
  document.getElementById("next-time").textContent = "00:10";

  // 🔁 Обновляем надпись "USD:RUB" / "UAH:RUB"
  document.getElementById("currency-name").textContent = `${base}:${target}`;

  return rate;
}

// === Настройки графика ===
let chart;
let currentBase = "USD";
let currentTarget = "RUB";

async function drawChart(base = "USD", target = "RUB") {
  const ctx = document.getElementById("currencyChart").getContext("2d");

  const labels = ["12.09", "19.09", "26.09", "03.10", "11.10"];
  const rates = [82.5, 83.1, 83.4, 83.0, await fetchRate(base, target)];

  if (chart) {
    chart.data.datasets[0].data = rates;
    chart.update();
    return;
  }

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
  currentBase = "USD"; currentTarget = "RUB";
  setActiveButton("btn-usd");
  drawChart(currentBase, currentTarget);
});

document.getElementById("btn-rub").addEventListener("click", () => {
  currentBase = "RUB"; currentTarget = "EUR";
  setActiveButton("btn-rub");
  drawChart(currentBase, currentTarget);
});

document.getElementById("btn-kzt").addEventListener("click", () => {
  currentBase = "KZT"; currentTarget = "RUB";
  setActiveButton("btn-kzt");
  drawChart(currentBase, currentTarget);
});

document.getElementById("btn-uah").addEventListener("click", () => {
  currentBase = "UAH"; currentTarget = "RUB";
  setActiveButton("btn-uah");
  drawChart(currentBase, currentTarget);
});

// === При загрузке страницы ===
window.addEventListener("DOMContentLoaded", () => {
  drawChart("USD", "RUB");
  setActiveButton("btn-usd");
});

// === Автообновление каждые 5 минут ===
setInterval(async () => {
  await drawChart(currentBase, currentTarget);
  console.log("График обновлён:", new Date().toLocaleTimeString());
}, 300000);
