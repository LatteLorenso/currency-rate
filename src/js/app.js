async function fetchRate() {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    const data = await response.json();
    const usdRate = data.Valute.USD.Value;

    
}