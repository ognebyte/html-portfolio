function setTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.checked = false;
    } else {
        document.body.classList.remove("light-theme");
        themeToggle.checked = true;
    }
}

// Проверяем сохранённую тему
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Если темы в localStorage нет, определяем её по системным настройкам
    let prefersDark = window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersDark ? "light" : "dark");
}