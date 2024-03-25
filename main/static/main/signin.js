
window.addEventListener('DOMContentLoaded', function () {

    async function signInAsync(email, password) {
        const response = await fetch('/api/token/', {
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

    function goToNotes(data) {
        if (data["Error"]) {
            document.querySelector("#info").innerHTML = data["Error"];
        }
        else if (data["key"]) {
            sessionStorage.setItem('token', data['key']);
            document.querySelector("#info").innerHTML = "All ok!";
            window.location.href = "/notes/"
        }
    }

    let signinButton = document.querySelector("#signinButton");
    signinButton.addEventListener("click", () => {
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;
        signInSync(email, password, goToNotes);
    }); 
});
