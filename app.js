(function () {
  const benefits = window.BENEFITS || [];
  const toast = document.getElementById("toast");
  const benefitText = document.getElementById("benefitText");
  const toastFoot = document.getElementById("toastFoot");
  const secInput = document.getElementById("sec");
  const toggleBtn = document.getElementById("toggle");
  const nowBtn = document.getElementById("now");
  const countEl = document.getElementById("count");
  const shownEl = document.getElementById("shown");
  const liveState = document.getElementById("liveState");
  const presets = document.getElementById("presets");

  let intervalSec = 10;
  let timer = null;
  let hideTimer = null;
  let paused = false;
  let lastIdx = -1;
  let count = Number(localStorage.getItem("salli_count") || 0);
  let shown = 0;

  countEl.textContent = String(count);

  function pickBenefit() {
    if (!benefits.length) return "اللهم صلِّ على محمد وعلى آل محمد.";
    let i = 0;
    do {
      i = Math.floor(Math.random() * benefits.length);
    } while (benefits.length > 1 && i === lastIdx);
    lastIdx = i;
    return benefits[i];
  }

  function showToast() {
    benefitText.textContent = pickBenefit();
    shown += 1;
    shownEl.textContent = String(shown);
    toastFoot.textContent = "المرة رقم " + count + "  ·  اضغط النافذة بعد أن تصلّي";
    toast.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideToast, 7000);
  }

  function hideToast() {
    toast.classList.remove("show");
  }

  function countedClose() {
    count += 1;
    localStorage.setItem("salli_count", String(count));
    countEl.textContent = String(count);
    hideToast();
  }

  function restartTimer() {
    if (timer) clearInterval(timer);
    if (paused) return;
    timer = setInterval(showToast, intervalSec * 1000);
  }

  function setPaused(v) {
    paused = v;
    toggleBtn.textContent = paused ? "تشغيل التذكير" : "إيقاف مؤقت";
    liveState.innerHTML = paused
      ? "التذكير متوقف مؤقتاً"
      : '<span class="pulse"></span> التذكير يعمل على هذه الصفحة';
    restartTimer();
  }

  function applySeconds(n) {
    n = Math.max(5, Math.min(86400, Number(n) || 10));
    intervalSec = n;
    secInput.value = String(n);
    presets.querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", Number(c.dataset.sec) === n);
    });
    restartTimer();
  }

  presets.addEventListener("click", function (e) {
    const b = e.target.closest(".chip");
    if (!b) return;
    applySeconds(b.dataset.sec);
  });
  secInput.addEventListener("change", function () {
    applySeconds(secInput.value);
  });
  toggleBtn.addEventListener("click", function () {
    setPaused(!paused);
  });
  nowBtn.addEventListener("click", showToast);
  document.getElementById("closeToast").addEventListener("click", function (e) {
    e.stopPropagation();
    hideToast();
  });
  toast.addEventListener("click", countedClose);

  function triggerExeDownload() {
    const a = document.createElement("a");
    a.href = "SalliAlaAlNabi.exe";
    a.download = "SalliAlaAlNabi.exe";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  document.getElementById("mainDownload").addEventListener("click", function (e) {
    e.preventDefault();
    triggerExeDownload();
  });
  document.getElementById("topDownload").addEventListener("click", function (e) {
    e.preventDefault();
    triggerExeDownload();
  });

  applySeconds(10);
  setTimeout(showToast, 900);
})();
