const qrContainer = document.getElementById('qrcode');
const merchantNameEl = document.getElementById('merchant-name');
const descriptionEl = document.getElementById('description');
const amountLabel = document.getElementById('amount-label');
const txnLabel = document.getElementById('txn-label');
const upiUriEl = document.getElementById('upi-uri');
const statusNote = document.getElementById('status-note');
const downloadBtn = document.getElementById('download-btn');
const sbiPayBtn = document.getElementById('sbi-pay-btn');
const tabUpi = document.getElementById('tab-upi');
const tabSbi = document.getElementById('tab-sbi');
const upiPanel = document.getElementById('upi-panel');
const sbiPanel = document.getElementById('sbi-panel');

const STATUS_PREFIX = 'payment-status-';

const defaults = {
  merchantName: 'Demo Merchant',
  upiId: 'demo@upi',
  amount: '1.00',
  notes: 'Payment',
  sbiPayUrl: 'https://www.sbiepay.sbi',
  txnId: `TXN${Date.now()}`
};

let activeConfig = defaults;

function getConfig() {
  const params = new URLSearchParams(window.location.search);
  return {
    merchantName: params.get('merchantName') || defaults.merchantName,
    upiId: params.get('upiId') || defaults.upiId,
    amount: params.get('amount') || defaults.amount,
    notes: params.get('notes') || defaults.notes,
    sbiPayUrl: params.get('sbiPayUrl') || defaults.sbiPayUrl,
    txnId: params.get('txnId') || defaults.txnId
  };
}

function buildUpiUri(config) {
  const encodedName = encodeURIComponent(config.merchantName);
  const encodedNote = encodeURIComponent(config.notes);
  return `upi://pay?pa=${config.upiId}&pn=${encodedName}&am=${config.amount}&cu=INR&tn=${encodedNote}&tr=${config.txnId}`;
}

function drawQr(text) {
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text,
    width: 220,
    height: 220
  });
}

function downloadQr() {
  const img = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
  if (!img) return;

  const link = document.createElement('a');
  link.download = 'payment-qr.png';
  link.href = img.tagName.toLowerCase() === 'img' ? img.src : img.toDataURL();
  link.click();
}

function redirectToSuccess(method) {
  const successUrl = new URL('success.html', window.location.href);
  successUrl.searchParams.set('status', 'success');
  successUrl.searchParams.set('method', method);
  successUrl.searchParams.set('txnId', activeConfig.txnId);
  successUrl.searchParams.set('amount', activeConfig.amount);
  successUrl.searchParams.set('merchantName', activeConfig.merchantName);
  window.location.href = successUrl.toString();
}

function checkLocalStatusAndRedirect() {
  const status = localStorage.getItem(`${STATUS_PREFIX}${activeConfig.txnId}`);
  if (status === 'success') {
    statusNote.textContent = 'Payment received. Redirecting to confirmation...';
    redirectToSuccess('UPI QR');
  }
}

function startAutoConfirmationPolling() {
  checkLocalStatusAndRedirect();
  setInterval(checkLocalStatusAndRedirect, 3000);
}

function switchTab(useUpi) {
  tabUpi.classList.toggle('active', useUpi);
  tabSbi.classList.toggle('active', !useUpi);
  upiPanel.classList.toggle('hidden', !useUpi);
  sbiPanel.classList.toggle('hidden', useUpi);
}

function openSbiPay() {
  const sbiUrl = new URL(activeConfig.sbiPayUrl);
  sbiUrl.searchParams.set('amount', activeConfig.amount);
  sbiUrl.searchParams.set('txnId', activeConfig.txnId);
  sbiUrl.searchParams.set('merchantName', activeConfig.merchantName);
  const returnUrl = new URL('success.html', window.location.href);
  returnUrl.searchParams.set('status', 'success');
  returnUrl.searchParams.set('method', 'SBIePay Debit Card');
  returnUrl.searchParams.set('txnId', activeConfig.txnId);
  returnUrl.searchParams.set('amount', activeConfig.amount);
  returnUrl.searchParams.set('merchantName', activeConfig.merchantName);
  sbiUrl.searchParams.set('returnUrl', returnUrl.toString());
  window.location.href = sbiUrl.toString();
}

(function init() {
  activeConfig = getConfig();
  const formattedAmount = Number(activeConfig.amount).toFixed(2);
  activeConfig.amount = formattedAmount;
  const upiUri = buildUpiUri(activeConfig);

  merchantNameEl.textContent = activeConfig.merchantName;
  descriptionEl.textContent = activeConfig.notes || 'Pay securely using UPI QR.';
  amountLabel.textContent = `Amount: ₹${formattedAmount}`;
  txnLabel.textContent = `Txn: ${activeConfig.txnId}`;
  upiUriEl.textContent = upiUri;

  drawQr(upiUri);
  downloadBtn.addEventListener('click', downloadQr);
  sbiPayBtn.addEventListener('click', openSbiPay);
  tabUpi.addEventListener('click', () => switchTab(true));
  tabSbi.addEventListener('click', () => switchTab(false));

  startAutoConfirmationPolling();
})();
