let activeNoteId = "";

let textareaNote = document.querySelector('#textareaNote');
let nameNote = document.querySelector('#namenote');
let submenu = document.querySelector(".submenu");
let desktop = document.querySelector(".desktop");
// -----------------------------------------------
// Кнопки переключения страниц
let cdNotes = document.querySelector("#cdNotes");
let cdNotifications = document.querySelector("#cdNotifications");
let cdProfile = document.querySelector("#cdProfile");
let cdSettings = document.querySelector("#cdSettings");
let cdHome = document.querySelector("#cdHome");
// -----------------------------------------------
// Кнопки "Ок" и "Отмена"
let buttonOk = document.querySelector(".buttonok");
let buttonCancel = document.querySelector(".buttoncancel");
// -----------------------------------------------
// PopUp Window
let popupWindow = document.querySelector("#popupwindow");
let inputPopup = document.querySelector('#inputPopup');
let textPopup = document.querySelector("#textPopup");
// -----------------------------------------------
// Кнопки управления заметкой
let backButton = document.querySelector("#backButton");
let createNotificationButton = document.querySelector("#createNotificationButton");
let saveButton = document.querySelector("#saveButton");
let deleteButton = document.querySelector("#deleteButton");
let addNoteButton = document.querySelector("#addNoteButton");
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

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

// -----------------------------------------------------------------------
// Управление заметкой

addNoteButton.addEventListener("click", createNewNoteHTML);
backButton.addEventListener("click", closeDesktop);
saveButton.addEventListener("click", saveNote);
deleteButton.addEventListener("click", deleteNote);

function createNewNoteHTML() {
    textareaNote.value = "";
    nameNote.innerHTML = "";
    activeNoteId = "";
    popupWindow.classList.add("active");
}

function saveNote() {
    if (activeNoteId) {
        setTimeout(changeNoteByIdSync(activeNoteId, '', textareaNote.value, (data) => {
            console.log(data);
        }), 10)
    } else {
        console.log("Заметка не открыта")
    }
}

function deleteNote() {
    if (activeNoteId) {
        deleteNoteByIdSync(activeNoteId, (data) => {
            console.log(data);
            getNotesSync(getNotesHTML);
        });
        setTimeout(closeDesktop, 10);
    } else {
        console.log("Заметка не открыта")
    }
}

function closeDesktop() {
    desktop.classList.remove("active");
    submenu.classList.remove("noactive");
    textareaNote.value = "";
    nameNote.innerHTML = "";
    activeNoteId = "";
    getNotesSync(getNotesHTML);
}

function clickOnNote(note) {
    console.log(note)
    getNoteByIdSync(note.id.substring(6), (data) => {
        nameNote.innerHTML = data["name"];
        textareaNote.value = data["text"];
        submenu.classList.add("noactive");
        desktop.classList.add("active");
        activeNoteId = note.id.substring(6);
    });
}

function getNotesHTML(data) {
    let submenuButtons = document.querySelector('.submenubuttons');
    submenuButtons.innerHTML = "";
    for (let key in data) {
        submenuButtons.innerHTML += `
        <div class="button2" id="noteId${data[key]['id']}">
            ${data[key]['name']}
        </div>
        `
    };
    // --------------------------------------------------------------
    let notes = document.querySelectorAll('.submenubuttons .button2');
    notes.forEach(function (note) {
        note.addEventListener('click', function (note) {
            getNoteByIdSync(this.id.substring(6), (data) => {
                nameNote.innerHTML = data["name"];
                textareaNote.value = data["text"];
                submenu.classList.add("noactive");
                desktop.classList.add("active");
                activeNoteId = this.id.substring(6);
            });
        });
    });
}


// -----------------------------------------------------------------------
// PopUp окно создания новой заметки


buttonCancel.addEventListener('click', () => {
    popupWindow.classList.remove("active");
})

buttonOk.addEventListener("click", () => {
    if (/\S/.test(inputPopup.value)) {
        submenu.classList.add("noactive");
        desktop.classList.add("active");
        popupWindow.classList.remove("active");
        nameNote.innerHTML = inputPopup.value;
        textPopup.innerHTML = "";
        createNoteSync(inputPopup.value, "", (data) => {console.log(data)});
        setTimeout(function () {
            getNotesSync(function (data) {
                activeNoteId = Object.keys(data)[Object.keys(data).length - 1]
            });
            inputPopup.value = "";
            getNotesSync(getNotesHTML);
        }, 10);
    } else {
        document.querySelector("#textPopup").innerHTML = "Напишите что-нибудь";
    }
})

// --------------------------------------------------------------------------------
// Дополнительные функции

function checkToken() {
    token = sessionStorage.getItem("token")
    if (!token) {
        window.location.href = "/signin/"
    }
}

window.addEventListener("DOMContentLoaded", function () {
    checkToken()
    getNotesSync(getNotesHTML);
});
