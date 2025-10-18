// === Получаем курс валют ===
async function fetchRate(base = "USD", target = "RUB") {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", { cache: "no-cache" });
  const data = await response.json();
  const rates = data.Valute;

  let rate;

  if (base === "RUB") {
    rate = 1 / rates[target].Value;
  } else if (target === "RUB") {
    rate = rates[base].Value;
  } else {
    rate = rates[base].Value / rates[target].Value;
  }

  // 💬 Показываем курс на странице
  document.querySelector(".chart").textContent = rate.toFixed(2);

  // 🕒 Обновляем время
  document.getElementById("update-time").textContent = new Date().toLocaleTimeString();
  document.getElementById("next-time").textContent = "00:10";

  // 🔁 Обновляем надпись "USD:RUB" / "RUB:EUR"
  document.getElementById("currency-name").textContent = `${base}:${target}`;

  return { rate, data };
}

// === Настройки графика ===
let chart;
let currentBase = "USD";
let currentTarget = "RUB";

// === График ===
async function drawChart(base = "USD", target = "RUB") {
  const ctx = document.getElementById("currencyChart").getContext("2d");

  const labels = ["12.09", "19.09", "26.09", "03.10", "11.10"];
  const { rate } = await fetchRate(base, target);
  const rates = [82.5, 83.1, 83.4, 83.0, rate];

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
      interaction: { intersect: false, mode: "index" },
      scales: {
        y: { display: false, grid: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

// === Таблица валют ===
async function renderRateTable(base = "USD") {
  const { data } = await fetchRate(base, "RUB");
  const valutes = data.Valute;
  const table = document.getElementById("rate-table");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Валюта</th>
      <th>Описание</th>
      <th>Курс</th>
      <th>Дата обновления</th>
    </tr>
  `;

  const dateStr = new Date(data.Date).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const codes = Object.keys(valutes).slice(0, 14);

  for (const code in valutes) {
    if (code === base) continue;

    let rate;
    if (base === "RUB") {
      rate = 1 / valutes[code].Value;
    } else if (valutes[base]) {
      rate = valutes[code].Value / valutes[base].Value;
    } else {
      continue;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${base}:${code}</td>
      <td>${valutes[code].Name}</td>
      <td>${rate.toFixed(2)}</td>
      <td>${dateStr}</td>
    `;

    row.addEventListener("click", () => {
      document.querySelectorAll("#rate-table tr").forEach(r => r.classList.remove("active-row"));
      row.classList.add("active-row");
      drawChart(base, code);
      document.getElementById("currency-name").textContent = `${base}:${code}`;
    });

    table.appendChild(row);
  }
}

// === Управление кнопками ===
function setActiveButton(id) {
  document.querySelectorAll(".btn-rate").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// === Кнопки ===
document.getElementById("btn-usd").addEventListener("click", () => {
  currentBase = "USD";
  setActiveButton("btn-usd");
  drawChart("USD", "RUB");
  renderRateTable("USD");
});

document.getElementById("btn-rub").addEventListener("click", () => {
  currentBase = "RUB";
  setActiveButton("btn-rub");
  drawChart("RUB", "EUR");
  renderRateTable("RUB");
});

document.getElementById("btn-kzt").addEventListener("click", () => {
  currentBase = "KZT";
  setActiveButton("btn-kzt");
  drawChart("KZT", "RUB");
  renderRateTable("KZT");
});

document.getElementById("btn-uah").addEventListener("click", () => {
  currentBase = "UAH";
  setActiveButton("btn-uah");
  drawChart("UAH", "RUB");
  renderRateTable("UAH");
});

// === При загрузке страницы ===
window.addEventListener("DOMContentLoaded", () => {
  drawChart("USD", "RUB");
  renderRateTable("USD");
  setActiveButton("btn-usd");
});

// === Автообновление каждые 5 минут ===
setInterval(async () => {
  await drawChart(currentBase, "RUB");
  renderRateTable(currentBase);
  console.log("Данные обновлены:", new Date().toLocaleTimeString());
}, 300000);
