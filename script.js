const lengthEl = document.getElementById("length");
const lenVal = document.getElementById("lenVal");
const pwdText = document.getElementById("pwdText");
const generateBtn = document.getElementById("generate");
const saveBtn = document.getElementById("saveBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const sets = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

lenVal.textContent = lengthEl.value;
lengthEl.addEventListener("input", () => (lenVal.textContent = lengthEl.value));

function cryptoRandInt(n) {
  const buf = new Uint8Array(1);
  const limit = Math.floor(256 / n) * n;
  while (true) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}

function buildPool() {
  let pool = "";
  if (document.getElementById("lower").checked) pool += sets.lower;
  if (document.getElementById("upper").checked) pool += sets.upper;
  if (document.getElementById("numbers").checked) pool += sets.numbers;
  if (document.getElementById("symbols").checked) pool += sets.symbols;
  return pool;
}

function generatePassword() {
  const pool = buildPool();
  const length = Number(lengthEl.value);
  if (!pool) {
    pwdText.textContent = "Select at least one character type.";
    return "";
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    const idx = cryptoRandInt(pool.length);
    out += pool[idx];
  }
  pwdText.textContent = out;
  evaluateStrength(out);
  return out;
}

function evaluateStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSym = /[^A-Za-z0-9]/.test(pwd);
  const variety = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length;
  score += Math.max(0, variety - 1);
  const pct = Math.min(100, (score / 4) * 100);
  strengthBar.style.width = pct + "%";
  let label = "Very weak";
  if (pct >= 80) label = "Very strong";
  else if (pct >= 60) label = "Strong";
  else if (pct >= 40) label = "Medium";
  else if (pct > 0) label = "Weak";
  strengthText.textContent = `${label} • ${pwd.length} chars`;
}

generateBtn.addEventListener("click", () => {
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  setTimeout(() => {
    generatePassword();
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate";
  }, 120);
});

saveBtn.addEventListener("click", () => {
  generatePassword();
});

copyBtn.addEventListener("click", async () => {
  const text = pwdText.textContent || "";
  if (!text || text.startsWith("--")) return;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch {
    alert("Copy failed — select and copy manually.");
  }
});

window.addEventListener("load", () => generatePassword());
