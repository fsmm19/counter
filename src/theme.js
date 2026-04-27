const btnTheme = document.getElementById('btn-theme');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

applyTheme(savedTheme ?? (prefersDark ? 'dark' : 'light'));

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  btnTheme.textContent = theme === 'dark' ? '☀' : '☽';
}

btnTheme.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});
