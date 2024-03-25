window.addEventListener('DOMContentLoaded', function () {

    function goToSignIn(data) {
        if (data["Error"]) {
            document.querySelector("#info").innerHTML = data["Error"];
        }
        else if (data["Ok"]) {
            document.querySelector("#info").innerHTML = "All ok!";
            window.location.href = "/signin/"
        }
    }

    let signupButton = document.querySelector("#signupButton");
    signupButton.addEventListener("click", () => {
        let email = document.querySelector("#email").value;
        let name = document.querySelector("#name").value;
        let password1 = document.querySelector("#password1").value;
        let password2 = this.document.querySelector("#password2").value;
        if (!(/\S/.test(email))) {
            document.querySelector("#info").innerHTML = "Email is empty";
        } else if (!(email.indexOf("@"))) {
            document.querySelector("#info").innerHTML = "Email is not correct";
        } else if (!(/\S/.test(name))) {
            document.querySelector("#info").innerHTML = "Name is empty";
        } else if (!(/\S/.test(password1))) {
            document.querySelector("#info").innerHTML = "Password1 is empty";
        } else if (!(/\S/.test(password2))) {
            document.querySelector("#info").innerHTML = "Password2 is empty";
        } else if (password1 !== password2) {
            document.querySelector("#info").innerHTML = "Passwords don't match";
        } else {
            document.querySelector("#info").innerHTML = "All ok!";
            // console.log("Всё отлично: ", email, name, password1)
            signUpSync(email, name, password1, password2, goToSignIn);
        }
    });
});