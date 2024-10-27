import { AudioManager } from "./audio-manager.js";
import { Visualizer } from "./visualizer.js";


const SKIP_AMOUNT_SECONDS = 15;
const DEFAULT_VOLUME = 0.7;


const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");
const shuffleButton = document.querySelector("#shuffle-button");
const loopButton = document.querySelector("#loop-button");

const playIcon = document.querySelector("#play-icon");
const pauseIcon = document.querySelector("#pause-icon");

const nowPlaying = document.querySelector("#now-playing");
const sliderContainer = document.querySelector("#progress-bar");
const slider = document.querySelector("#progress-slider");


let canvas;
let context = undefined;
let analyser;

let audioManager;


function playOrPause()
{
    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];

        if (!audioManager.isPlaying())
        {
            el.style.opacity = "1";
            el.style.visibility = "visible";
        }
        else
        {
            el.addEventListener("transitionend", () => el.style.visibility = "hidden", {once: true});
            el.style.opacity = "0";
        }
    }

    playIcon.style.display = audioManager.isPlaying() ? "block" : "none";
    pauseIcon.style.display = audioManager.isPlaying() ? "none" : "block";

    if (!audioManager.isPlaying())
    {
        audioManager.play().then(() =>
        {
            nowPlaying.textContent = audioManager.getTitle();
        });
    }
    else
    {
        audioManager.pause();
    }
}
playPauseButton.addEventListener("click", () => playOrPause());


loopButton.addEventListener("click", () =>
{
    if (audioManager.isLooping())
    {
        audioManager.setLooping(false);
        loopButton.classList.remove("pressed");
    }
    else
    {
        audioManager.setLooping(true);
        loopButton.classList.add("pressed");
    }
});


shuffleButton.addEventListener("click", () =>
{
    if (audioManager.isShuffling())
    {
        audioManager.setShuffling(false);
        shuffleButton.classList.remove("pressed");
    }
    else
    {
        audioManager.setShuffling(true);
        shuffleButton.classList.add("pressed");
    }
});


window.addEventListener("keydown", async event =>
{
    if (event.key === " ")
    {
        playOrPause();
    }
    else if (audioManager.isPlaying())
    {
        if (event.key === "MediaTrackPrevious")
            await audioManager.moveToNextOrPreviousSong(false);
        else if (event.key === "MediaTrackNext")
            await audioManager.moveToNextOrPreviousSong(true);
        else if (event.key === "ArrowLeft")
            audioManager.skipBackwardsOrForward(false, SKIP_AMOUNT_SECONDS);
        else if (event.key === "ArrowRight")
            audioManager.skipBackwardsOrForward(true, SKIP_AMOUNT_SECONDS);
    }
});


navigator.mediaSession.setActionHandler("play", async () => playOrPause());
navigator.mediaSession.setActionHandler("pause", async () => playOrPause());

navigator.mediaSession.setActionHandler("previoustrack", async () =>
{
    await audioManager.moveToNextOrPreviousSong(false);
});

navigator.mediaSession.setActionHandler("nexttrack", async () =>
{
    await audioManager.moveToNextOrPreviousSong(true);
});


prevButton.addEventListener("click", () => audioManager.moveToNextOrPreviousSong(false));
backwardsButton.addEventListener("click", () => audioManager.skipBackwardsOrForward(false, SKIP_AMOUNT_SECONDS));
forwardButton.addEventListener("click", () => audioManager.skipBackwardsOrForward(true, SKIP_AMOUNT_SECONDS));
nextButton.addEventListener("click", () => audioManager.moveToNextOrPreviousSong(true));


sliderContainer.addEventListener("click", event =>
{
    const bounding = sliderContainer.getBoundingClientRect();
    const x = event.clientX - bounding.left;

    const newProportion = x / sliderContainer.clientWidth;
    audioManager.setAudioProgressByPercent(newProportion);
});


window.addEventListener("load", () =>
{
    Howler.usingWebAudio = true;
    Howler.volume(DEFAULT_VOLUME);

    audioManager = new AudioManager(nowPlaying);

    canvas = document.getElementById("eq-canvas");
    canvas.width = window.innerWidth;

    if (context === undefined)
    {
        Visualizer.init(analyser, canvas);
        Visualizer.setSource(audioManager.getAudio()._sounds[0]._node);
    }

    animate();
}, false);


function animate()
{
    window.RequestAnimationFrame = window.requestAnimationFrame(animate)
        || window.msRequestAnimationFrame(animate)
        || window.mozRequestAnimationFrame(animate)
        || window.webkitRequestAnimationFrame(animate);

    Visualizer.draw();

    const percent = audioManager.getAudioProgressPercent();
    slider.style.width = `${sliderContainer.clientWidth * percent}px`;
}


window.addEventListener("resize", () => { if (canvas) canvas.width = window.innerWidth; });