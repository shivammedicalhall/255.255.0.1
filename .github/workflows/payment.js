const qrContainer = document.getElementById('qrcode');
const merchantNameEl = document.getElementById('merchant-name');
const descriptionEl = document.getElementById('description');
const amountLabel = document.getElementById('amount-label');
const upiUriEl = document.getElementById('upi-uri');
const downloadBtn = document.getElementById('download-btn');

const defaults = {
  merchantName: 'Demo Merchant',
  upiId: 'demo@upi',
  amount: '1.00',
  notes: 'Payment'
};

function getConfig() {
  const params = new URLSearchParams(window.location.search);
  return {
    merchantName: params.get('merchantName') || defaults.merchantName,
    upiId: params.get('upiId') || defaults.upiId,
    amount: params.get('amount') || defaults.amount,
    notes: params.get('notes') || defaults.notes
  };
}

function buildUpiUri(config) {
  const encodedName = encodeURIComponent(config.merchantName);
  const encodedNote = encodeURIComponent(config.notes);
  return `upi://pay?pa=${config.upiId}&pn=${encodedName}&am=${config.amount}&cu=INR&tn=${encodedNote}`;
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

(function init() {
  const config = getConfig();
  const formattedAmount = Number(config.amount).toFixed(2);
  const upiUri = buildUpiUri({ ...config, amount: formattedAmount });

  merchantNameEl.textContent = config.merchantName;
  descriptionEl.textContent = config.notes || 'Pay securely using UPI QR.';
  amountLabel.textContent = `Amount: ₹${formattedAmount}`;
  upiUriEl.textContent = upiUri;

  drawQr(upiUri);
  downloadBtn.addEventListener('click', downloadQr);
})();
