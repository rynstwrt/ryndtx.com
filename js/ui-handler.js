const CONTACT_EMAIL = "mgmt@ryndtx.com";
const POPUP_DURATION_MS = 1000;


const copiedPopup = document.querySelector("#copied-email-popup");


document.querySelector("#email-button").addEventListener("click", () =>
{
    if (!copiedPopup.classList.contains("hidden"))
        return;

    navigator.clipboard.writeText(CONTACT_EMAIL).then(() =>
    {
        copiedPopup.classList.remove("hidden");
        setTimeout(() =>
        {
            copiedPopup.classList.add("hidden");
        }, POPUP_DURATION_MS);
    });
});