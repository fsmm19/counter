const theme = { value: getColorPreference() };

reflectPreference();

window.addEventListener('load', () => {
  reflectPreference();

  document.getElementById('btn-theme').addEventListener('click', () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    setPreference();
  });
});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    theme.value = isDark ? 'dark' : 'light';
    setPreference();
  });

function getColorPreference() {
  return (
    localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  );
}

function setPreference() {
  localStorage.setItem('theme', theme.value);
  reflectPreference();
}

function reflectPreference() {
  document.documentElement.dataset.theme = theme.value;
  document.getElementById('btn-theme')?.setAttribute('aria-label', theme.value);
}
