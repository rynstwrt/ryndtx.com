const playPauseButton = document.querySelector("#play-pause-button");
const playIcon = document.querySelector("#play-icon");
const pauseIcon = document.querySelector("#pause-icon");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const backwardButton = document.querySelector("#backward-button");
const forwardButton = document.querySelector("#forward-button");
const shuffleButton = document.querySelector("#shuffle-button");
const loopButton = document.querySelector("#loop-button");

const nowPlaying = document.querySelector("#now-playing");

const eqCanvas = document.querySelector("#eq-canvas");

const toggleableElements = document.querySelectorAll(".toggleable");


const audioManager = new AudioManager();


function onPlayPauseButtonPressed()
{
    for (let el of toggleableElements)
    {
        if (audioManager.isPlaying())
        {
            el.addEventListener("transitionend", () => el.style.visibility = "hidden", {once: true});
            el.style.opacity = "0";
        }
        else
        {
            el.style.opacity = "1";
            el.style.visibility = "visible";
        }
    }

    if (audioManager.isPlaying())
    {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }
    else
    {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    }

    if (!audioManager.isPlaying())
    {
        audioManager.play().then(() =>
        {
            nowPlaying.textContent =
        });
    }
    else
    {
        audioManager.pause();
    }
}


playPauseButton.addEventListener("click", onPlayPauseButtonPressed);


// window.addEventListener("load", () =>
// {
//
// }, false);