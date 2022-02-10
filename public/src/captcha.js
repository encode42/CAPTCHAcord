const form = document.getElementById("form");
const redirect = document.getElementById("redirect");

// Method ran when the captcha script is loaded
async function onLoad() {
    grecaptcha.execute();
}

// Method ran when the captcha is submitted
async function onSubmit() {
    redirect.innerHTML = "Redirecting...";

    // Submit the form to create invite
    fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    }).then(async res => {
        if (res.ok) {
            // Parse the response
            const json = await res.json();
            if (json.isExisting) {
                // The invite already exists
                redirect.innerHTML = "Redirecting to existing invite...";
            }

            // Redirect to invite
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
    console.error(response?.error() || response);
}

// Make above functions global
window.onLoad = onLoad;
window.onSubmit = onSubmit;
