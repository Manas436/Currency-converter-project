// Use a CORS-friendly API
const BASE_URL = "https://api.exchangerate.host/latest";

const dropdown = document.querySelectorAll(".dropdown select");
const fromSelect = document.querySelector('select[name="from"]');
const toSelect = document.querySelector('select[name="to"]');
const msgDiv = document.querySelector('.msg');
const amountInput = document.querySelector('.amount input');

// Populate dropdowns
function populateDropdown(select, selectedCode) {
  for (let code in countryList) {
    let option = document.createElement('option');
    option.value = code;
    option.text = code;
    if (code === selectedCode) option.selected = true;
    select.appendChild(option);
  }
}
populateDropdown(fromSelect, 'USD');
populateDropdown(toSelect, 'INR');

// Update flag images when dropdown changes
function updateFlag(select, img) {
  let countryCode = countryList[select.value];
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}
const fromImg = document.querySelector('.from .select-container img');
const toImg = document.querySelector('.to .select-container img');
fromSelect.addEventListener('change', () => updateFlag(fromSelect, fromImg));
toSelect.addEventListener('change', () => updateFlag(toSelect, toImg));

// Prevent form submission from reloading the page and fetch exchange rate
const form = document.querySelector("form");
form.addEventListener("submit", async function(event) {
  event.preventDefault();
  let amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    msgDiv.innerText = 'Please enter a valid amount.';
    return;
  }
  let from = fromSelect.value;
  let to = toSelect.value;
  msgDiv.innerText = 'Fetching rate...';
  try {
    // Workaround: fetch both rates relative to EUR and calculate manually
    let url = `${BASE_URL}?symbols=${from},${to}`;
    console.log('Fetching:', url);
    let res = await fetch(url);
    console.log('Response status:', res.status);
    let data = await res.json();
    console.log('API data:', data);
    let rates = data.rates;
    if (!rates || !rates[from] || !rates[to]) throw new Error('No rate found');
    // Convert: amount_in_to = amount * (rate_to / rate_from)
    let rate = rates[to] / rates[from];
    let total = (amount * rate).toFixed(2);
    msgDiv.innerText = `${amount} ${from} = ${total} ${to}`;
  } catch (err) {
    console.error('Error fetching exchange rate:', err);
    msgDiv.innerText = 'Failed to fetch exchange rate.';
  }
});