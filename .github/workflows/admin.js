const form = document.getElementById('config-form');
const result = document.getElementById('result');
const generatedLinkInput = document.getElementById('generatedLink');
const openLink = document.getElementById('openLink');

const STORAGE_KEY = 'payment-gateway-config';

const defaultConfig = {
  merchantName: 'Demo Merchant',
  upiId: 'demo@upi',
  amount: '1.00',
  notes: 'Payment'
};

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function loadConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultConfig;
  try {
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

function buildCustomerLink(config) {
  const params = new URLSearchParams(config);
  const customerUrl = new URL('index.html', window.location.href);
  customerUrl.search = params.toString();
  return customerUrl.toString();
}

(function init() {
  const saved = loadConfig();
  document.getElementById('merchantName').value = saved.merchantName;
  document.getElementById('upiId').value = saved.upiId;
  document.getElementById('amount').value = saved.amount;
  document.getElementById('notes').value = saved.notes;
})();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const config = {
    merchantName: document.getElementById('merchantName').value.trim(),
    upiId: document.getElementById('upiId').value.trim(),
    amount: Number(document.getElementById('amount').value).toFixed(2),
    notes: document.getElementById('notes').value.trim()
  };

  saveConfig(config);

  const customerLink = buildCustomerLink(config);
  generatedLinkInput.value = customerLink;
  openLink.href = customerLink;
  result.classList.remove('hidden');
});
