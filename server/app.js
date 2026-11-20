const form = document.getElementById("ssh-settings");
const userField = document.getElementById("ssh-user");
const hostField = document.getElementById("ssh-host");
const sshCommand = document.getElementById("ssh-command");
const settingsStatus = document.getElementById("settings-status");
const copyStatus = document.getElementById("copy-status");
const storageKey = "server-handbook-ssh-v1";

function validProfile(user, host) {
  return typeof user === "string" && typeof host === "string"
    && /^[a-zA-Z0-9_][a-zA-Z0-9_-]{0,31}$/.test(user)
    && /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,252}$/.test(host);
}

function showProfile(user, host) {
  sshCommand.textContent = `ssh ${user}@${host}`;
}

try {
  const profile = JSON.parse(localStorage.getItem(storageKey));
  if (profile && validProfile(profile.user, profile.host)) {
    userField.value = profile.user;
    hostField.value = profile.host;
    showProfile(profile.user, profile.host);
  }
} catch {
  // Commands remain available when browser storage is disabled.
}

form.hidden = false;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = userField.value.trim();
  const host = hostField.value.trim();
  if (!validProfile(user, host)) {
    settingsStatus.textContent = "請輸入有效的 Ubuntu 帳號及 IPv4 位址或主機名稱。";
    return;
  }
  showProfile(user, host);
  try {
    localStorage.setItem(storageKey, JSON.stringify({ user, host }));
    settingsStatus.textContent = "已儲存到此瀏覽器。";
  } catch {
    settingsStatus.textContent = "連線指令已更新，關閉頁面後需重新輸入。";
  }
});

const copyTimers = new WeakMap();
for (const button of document.querySelectorAll("[data-copy]")) {
  const command = document.getElementById(button.dataset.copy);
  const label = button.previousElementSibling.textContent;
  button.setAttribute("aria-label", `複製 ${label}`);
  button.hidden = false;
  button.addEventListener("click", async () => {
    clearTimeout(copyTimers.get(button));
    try {
      await navigator.clipboard.writeText(command.textContent.trim());
      button.textContent = "已複製";
      copyStatus.textContent = `已複製 ${label}`;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(command);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "已選取";
      copyStatus.textContent = "指令已選取。請按 Command+C 或 Ctrl+C 複製。";
    }
    copyTimers.set(button, setTimeout(() => {
      button.textContent = "複製";
    }, 1800));
  });
}

const toc = [...document.querySelectorAll(".sidebar a")].map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1)),
}));
let scrollFrame = 0;

function updateToc() {
  scrollFrame = 0;
  const offset = 90;
  const atBottom = window.scrollY > 0
    && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const active = atBottom ? toc.at(-1) : toc.findLast(({ section }) =>
    section.getBoundingClientRect().top <= offset) || toc[0];
  for (const entry of toc) {
    if (entry === active) entry.link.setAttribute("aria-current", "location");
    else entry.link.removeAttribute("aria-current");
  }
}

function scheduleToc() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateToc);
}

window.addEventListener("scroll", scheduleToc, { passive: true });
window.addEventListener("resize", scheduleToc);
window.addEventListener("hashchange", scheduleToc);
updateToc();
