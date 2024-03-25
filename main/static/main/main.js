let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('DOMContentLoaded', function () {
    let signupButton = document.querySelector("#signup");
    console.log(document.querySelector("#signup"));
    signupButton.addEventListener("click", () => {window.location.href = '/signup/'});


    let signinButton = document.querySelector("#signin"); 
    signinButton.addEventListener("click", () => {window.location.href = '/signin/'});
});
