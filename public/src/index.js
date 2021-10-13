const form = document.getElementById("form");
const redirect = document.getElementById("redirect");

// Run the captcha
window.addEventListener("load", () => {
    const captcha = document.createElement("div");
    captcha.className = "g-recaptcha";
    captcha.dataset.callback = "onSubmit";
    captcha.dataset.size = "invisible";
    captcha.dataset.sitekey = siteKey;

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=onLoad";

    form.append(captcha);
    form.append(script);
});

// Method ran when the captcha script is loaded
async function onLoad() {
    grecaptcha.execute();
}

// Method ran when the captcha is submitted
function onSubmit() {
    const url = form.action;
    const data = new FormData(form);

    // Create the invite
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(data.entries()))
    }).then(async res => {
        if (res.ok) {
            redirect.innerHTML = "Redirecting...";

            // Redirect to invite
            const json = await res.json();
            window.location = json.url;
        } else {
            // Display an error message
            displayError(res);
        }
    }).catch(e => {
        displayError(e);
    });
}

function displayError(response) {
    redirect.innerHTML = "An error occurred. Refresh the page or contact the instance owner.";

    if (response?.error) {
        console.error(res.error());
        return;
    }

    if (!(response instanceof Response)) {
        console.error(response);
    }
}

// Make above functions global
window.onLoad = onLoad;
window.onSubmit = onSubmit;