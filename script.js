const apiKey = "6489d5a9eaa061f37c905b2b";
const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultElement = document.getElementById("result");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const conversionDetails = document.getElementById("conversionDetails");

function getCountryCode(currency) {
    const currencyToCountry = {
        "USD": "us", "EUR": "eu", "GBP": "gb", "RUB": "ru", "UZS": "uz",
        "JPY": "jp", "CNY": "cn", "AUD": "au", "CAD": "ca", "INR": "in",
        "KRW": "kr", "KZT": "kz", "TRY": "tr", "AED": "ae"
    };
    return currencyToCountry[currency] || currency.slice(0, 2).toLowerCase();
}

async function fetchCurrency() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        const currencies = Object.keys(data.conversion_rates);
        
        currencies.forEach(currency => {
            fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
            toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
        });
        fromCurrency.value = "USD";
        toCurrency.value = "UZS";
        updateFlags();
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

async function convertCurrency() {
    try {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount <= 0) {
            resultElement.textContent = "Введите сумму!";
            return;
        }
        
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
        const response = await fetch(url);
        const data = await response.json();
        resultElement.textContent = data.conversion_result.toFixed(2);
        conversionDetails.textContent = `${amount} ${from} → ${data.conversion_result.toFixed(2)} ${to}`;
    } catch (error) {
        console.error("Conversion error:", error);
    }
}

function updateFlags() {
    const fromCode = getCountryCode(fromCurrency.value);
    const toCode = getCountryCode(toCurrency.value);

    fromFlag.src = `https://flagcdn.com/w40/${fromCode}.png`;
    toFlag.src = `https://flagcdn.com/w40/${toCode}.png`;
}

fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);
convertBtn.addEventListener("click", convertCurrency);
fetchCurrency();