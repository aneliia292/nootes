let activeNotificationId = "";

let nameNotification = document.querySelector('#nameNotification');
let submenu = document.querySelector(".submenu");
let desktop = document.querySelector(".desktop");
// -----------------------------------------------
// Кнопки переключения страниц
let cdNotes = document.querySelector("#cdNotes");
let cdNotifications = document.querySelector("#cdNotifications");
let cdProfile = document.querySelector("#cdProfile");
let cdSettings = document.querySelector("#cdSettings");
let cdHome = document.querySelector("#cdHome");
// ----------------------------------------------------
// Кнопки управления уведомлением
let addNotificationButton = document.querySelector("#addNotificationButton");
let selectNoteNotification = document.querySelector("#selectNoteNotification");
let selectTypeNotification = document.querySelector("#selectTypeNotification");
let saveButton = document.querySelector("#saveButton");
// Значения уведомления
let headerInput = document.querySelector("#header");
let textInput = document.querySelector("#text");
let dateInput = document.querySelector("#date");
let timeInput = document.querySelector("#time");
let infoP = document.querySelector("#info");



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


// -----------------------------------------------
// Управление уведомлением

addNotificationButton.addEventListener("click", () => {
    openDesktop();
    clearValuesForNotifications();
    infoP.innerHTML = "";
    activeNotificationId = "";
    nameNotification.innerHTML = "Новое уведомление";
});

backButton.addEventListener("click", () => {
    closeDesktop();
    infoP.innerHTML = "";
    nameNotification.innerHTML = "";
});

saveButton.addEventListener("click", saveNotification);
deleteButton.addEventListener("click", deleteNotification);


function clearValuesForNotifications() {
    dateInput.value = "";
    timeInput.value = "";
    headerInput.value = "";
    textInput.value = "";
    infoP.innerHTML = "";
    selectNoteNotification.value = "1";
    selectTypeNotification.value = "";
}

function deleteNotification() {
    if (activeNotificationId) {
        deleteNotificationByIdSync(activeNotificationId, (data) => {
            console.log(data);
        });
        clearValuesForNotifications();
        setTimeout(closeDesktop, 100);
    }
}

function saveNotification() {
    let date = dateInput.value;
    let time = timeInput.value;
    let header = headerInput.value;
    let text = textInput.value;
    let noteId = selectNoteNotification.value;
    let typeNotification = selectTypeNotification.value;
    if (/\S/.test(activeNotificationId)) {
        changeNotificationByIdSync(activeNotificationId, header, text, date, time, typeNotification, false, checkAnswerAboutCreateNOtification);
    } else {
        createNotificationSync(noteId, header, text, date, time, typeNotification, checkAnswerAboutCreateNOtification);
    }
}

function checkAnswerAboutCreateNOtification(data) {
    console.log(data);
    if (data["ok"]) {
        activeNotificationId = ""
        infoP.innerHTML = "";
        setTimeout(closeDesktop, 10);
    } else if (data["Error"]) {
        infoP.innerHTML = data["Error"];
    }
    getNotificationsSync(getNotificationsHTML)
}

function closeDesktop() {
    submenu.classList.remove("noactive");
    desktop.classList.remove("active");
    clearValuesForNotifications();
    getNotificationsSync(getNotificationsHTML);
}


function openDesktop() {
    clearValuesForNotifications();
    submenu.classList.add("noactive");
    desktop.classList.add("active");
    getNotesSync(loadNotesForSelect);
}

function loadNotesForSelect(data) {
    NotesIds = Object.keys(data);
    selectNoteNotification.innerHTML = "";
    NotesIds.forEach(function (noteId) {
        selectNoteNotification.innerHTML += `
        <option value=${noteId}>${data[noteId]["name"]}</option>
        `
    });
}

// --------------------------------------------------

function getNotificationsHTML(data) {
    let submenuButtons = document.querySelector('.submenubuttons');
    submenuButtons.innerHTML = "";
    for (let key in data) {
        submenuButtons.innerHTML += `
        <div class="button2" id="notificationId${data[key]['id']}">
            ${data[key]['header']}
        </div>
        `
    };
    // --------------------------------------------------------------
    let notifications = document.querySelectorAll('.submenubuttons .button2');
    notifications.forEach(function (notification) {
        notification.addEventListener('click', function (notification) {
            getNotificationByIdSync(this.id.substring(14), (data) => {
                console.log(data);
                getNotesSync(loadNotesForSelect);
                nameNotification.innerHTML = data["header"];
                submenu.classList.add("noactive");
                desktop.classList.add("active");
                activeNotificationId = this.id.substring(14);
                dateInput.value = data["date"];
                timeInput.value = data["time"];
                headerInput.value = data["header"];
                textInput.value = data["text"];
                selectNoteNotification.value = data["note_id"];
                selectTypeNotification.value = data["type"];
                infoP.innerHTML = "";
            });
        });
    });
}

function checkToken() {
    token = sessionStorage.getItem("token")
    if (!token) {
        window.location.href = "/signin/"
    }
}

window.addEventListener("DOMContentLoaded", function () {
    checkToken()
    getNotificationsSync(getNotificationsHTML);
});
