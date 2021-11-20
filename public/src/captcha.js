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

    if (serverName) {
        const title = document.getElementsByTagName("title")[0];
        title.innerHTML = `${serverName} - ${title.innerHTML}`;
    }

    redirect.innerHTML = `You will be redirected${serverName ? ` to ${serverName} ` : ""} after solving a captcha.`;
});

// Method ran when the captcha script is loaded
async function onLoad() {
    grecaptcha.execute();
}

// Method ran when the captcha is submitted
async function onSubmit() {
    redirect.innerHTML = "Redirecting...";

    const url = form.action;
    const data = new FormData(form);
    data.append("key", key);

    // Create the invite
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries()))
    }).then(async res => {
        if (res.ok) {
            // Parse the response
            const json = await res.json();
            if (json.isExisting) {
                // The invite already exists
                redirect.innerHTML = "Redirecting to existing invite...";
                await new Promise(resolve => setTimeout(resolve, 1250));
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

    if (response instanceof Response) {
        if (response.error) {
            console.error(response.error());
        }

        return;
    }

    console.error(response);
}

// Make above functions global
window.onLoad = onLoad;
window.onSubmit = onSubmit;