// Free Frankfurter API (no key required)
const BASE_URL = "https://api.frankfurter.app/latest";

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
    // Frankfurter API
    let url = `${BASE_URL}?amount=${amount}&from=${from}&to=${to}`;
    console.log('Fetching:', url);
    let res = await fetch(url);
    console.log('Response status:', res.status);
    let data = await res.json();
    console.log('API data:', data);

    if (!data.rates || !data.rates[to]) throw new Error('No rate found');

    let total = data.rates[to].toFixed(2);
    msgDiv.innerText = `${amount} ${from} = ${total} ${to}`;
  } catch (err) {
    console.error('Error fetching exchange rate:', err);
    msgDiv.innerText = 'Failed to fetch exchange rate.';
  }
});


