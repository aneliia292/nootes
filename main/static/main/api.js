// URL string
const usersApiURL = '/api/users/' // Получение списка пользователей или создание пользователя
const userApiURL = '/api/user/' // Работа с пользователем
const tokenApiURL = '/api/token/' // Вход пользователя и получение токена
const logoutApiURL = '/api/logout/' // Выход пользователя и удаление токена
const notesApiURL = '/api/notes/' // Получение списка заметок или создание новой заметки
const noteApiURL = '/api/note/id/' // Работа с заметкой по id
const notificationsApiURL = '/api/notifications/' // Получение списка уведомлений или создание нового уведомления
const notificationApiURL = '/api/notification/id/' // Работа с уведомлением по id

const loginPageURL = '/signin/'  // Страница входа
const registrationPageURL = '/signup/'  // Страница регистрации
const notesPageURL = '/notes/'  // Страница заметок
const notificationsPageURL = '/notifications/'  // Страница уведомлений
const profilePageURL = '/profile/'  // Страница профиля
const settingsPageURL = '/settings/'  // Страница настроек
// ----------------------------------------------------------------------
// API Входа

async function signInAsync(email, password) {
    const response = await fetch(tokenApiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    const data = await response.json();
    return data;
}

function signInSync(email, password, yourFunction) {
    signInAsync(email, password).then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Регистрации


async function signUpAsync(email, name, password, passwordagain) {
    const response = await fetch(usersApiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            passwordagain: passwordagain
        })
    });
    const data = await response.json();
    if (data['key']) {
        sessionStorage.setItem("token", data['key']);
    }
    return data;
}

function signUpSync(email, name, password, passwordagain, yourFunction) {
    signUpAsync(email, name, password, passwordagain).then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API выхода из аккаунта

async function logoutAsync() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(logoutApiURL, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function logoutSync(yourFunction) {
    logoutAsync().then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API получения информации о себе (пользователе)

async function getInfoAboutUserAsync() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(userApiURL, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function getInfoAboutUserSync(yourFunction) {
    getInfoAboutUserAsync().then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Получения заметок

async function getNotesAsync() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notesApiURL, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function getNotesSync(yourFunction) {
    getNotesAsync().then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Создания заметки

async function createNoteAsync(name, text) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notesApiURL, {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            text: text
        })
    });
    const data = await response.json();
    return data;
}

function createNoteSync(name, text, yourFunction) {
    createNoteAsync(name, text).then(answer => {
        yourFunction(answer);
    })
}


// ----------------------------------------------------------------------
// API Получения заметки по id

async function getNoteByIdAsync(idNote) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(noteApiURL + idNote + "/", {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function getNoteByIdSync(idNote, yourFunction) {
    getNoteByIdAsync(idNote).then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Изменения заметки по id


async function changeNoteByIdAsync(idNote, name, text) {
    const token = sessionStorage.getItem('token');
    // -------------------------------------------
    let myJson = {};
    if (name) {
        myJson['name'] = name;
    }
    if (text) {
        myJson['text'] = text;
    }
    // -------------------------------------------
    const response = await fetch(noteApiURL + idNote + "/", {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myJson)
    });
    const data = await response.json();
    return data;
}

function changeNoteByIdSync(idNote, name, text, yourFunction) {
    changeNoteByIdAsync(idNote, name, text).then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Удаления заметки по id


async function deleteNoteByIdAsync(idNote) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(noteApiURL + idNote + "/", {
        method: 'DELETE',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function deleteNoteByIdSync(idNote, yourFunction) {
    deleteNoteByIdAsync(idNote).then(answer => {
        yourFunction(answer);
    })
}


// ----------------------------------------------------------------------
// API Получения уведомлений

async function getNotificationsAsync() {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notificationsApiURL, {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function getNotificationsSync(yourFunction) {
    getNotificationsAsync().then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Создания уведомления

async function createNotificationAsync(idNote, header, text, date, time, typeNotification) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notificationsApiURL, {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            note_id: idNote,
            header: header,
            text: text,
            date: date,
            time: time,
            type: typeNotification
        })
    });
    const data = await response.json();
    return data;
}

function createNotificationSync(idNote, header, text, date, time, typeNotification, yourFunction) {
    createNotificationAsync(idNote, header, text, date, time, typeNotification).then(answer => {
        yourFunction(answer);
    })
}

// ----------------------------------------------------------------------
// API Получение уведомления по id


async function getNotificationByIdAsync(idNotification) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notificationApiURL + idNotification + "/", {
        method: 'GET',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function getNotificationByIdSync(idNotification, yourFunction) {
    getNotificationByIdAsync(idNotification).then(answer => {
        yourFunction(answer);
    })
}


// ----------------------------------------------------------------------
// API Изменения уведомления по id

async function changeNotificationByIdAsync(idNotification, header, text, date, time, typeNotification, isRead) {
    const token = sessionStorage.getItem('token');
    // -------------------------------------------
    let myJson = {};
    if (header) {
        myJson['header'] = header;
    }
    if (text) {
        myJson['text'] = text;
    }
    if (date) {
        if (time) {
            myJson['date'] = date;
            myJson['time'] = time;
        }
    }
    if (typeNotification) {
        myJson['type'] = typeNotification;
    }
    if (isRead) {
        myJson['is_read'] = isRead;
    }
    // -------------------------------------------
    const response = await fetch(notificationApiURL + idNotification + "/", {
        method: 'POST',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myJson)
    });
    const data = await response.json();
    return data;
}

function changeNotificationByIdSync(idNotification, header, text, date, time, typeNotification, isRead, yourFunction) {
    changeNotificationByIdAsync(idNotification, header, text, date, time, typeNotification, isRead).then(answer => {
        yourFunction(answer);
    })
}


// ----------------------------------------------------------------------
// API Удаления уведомления по id


async function deleteNotificationByIdAsync(idNotification) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(notificationApiURL + idNotification + "/", {
        method: 'DELETE',
        headers: {
            'token': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

function deleteNotificationByIdSync(idNotification, yourFunction) {
    deleteNotificationByIdAsync(idNotification).then(answer => {
        yourFunction(answer);
    })
}


