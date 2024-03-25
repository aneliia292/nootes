// Кнопки переключения страниц
let cdNotes = document.querySelector("#cdNotes");
let cdNotifications = document.querySelector("#cdNotifications");
let cdProfile = document.querySelector("#cdProfile");
let cdSettings = document.querySelector("#cdSettings");
let cdHome = document.querySelector("#cdHome");

// Назначение кнопок
// -----------------
// Переход на другие страницы

cdNotifications.addEventListener('click', () => {
    window.location.href = "/notifications/"
});

cdProfile.addEventListener('click', () => {
    window.location.href = "/profile/"
});

cdNotes.addEventListener('click', () => {
    window.location.href = "/notes/"
});

cdHome.addEventListener('click', () => {
    window.location.href = "/"
});

cdSettings.addEventListener('click', () => {
    window.location.href = "/settings/"
});
