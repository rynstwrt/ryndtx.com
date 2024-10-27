import { Visualizer } from "./visualizer.js";


const TITLE_PREFIX = "RynDTX - ";
const TRANSITION_TIME_MS = 150;


class AudioManager
{
    #songIndex = AUDIOS.length - 1;
    #audio = undefined;
    #shuffling = false;
    #nowPlaying = undefined;


    constructor(nowPlaying)
    {
        this.#nowPlaying = nowPlaying;
        this.#loadSong(AUDIO_PATH + AUDIOS[this.#songIndex].file);
    }


    async #loadSong(file)
    {
        this.#audio = new Howl({ src: file });

        this.#audio.on("end", () =>
        {
            if (this.#audio.loop())
                return;

            this.moveToNextOrPreviousSong(true);
        });
    }


    getAudio()
    {
        return this.#audio;
    }


    getTitle()
    {
        const currentAudio = AUDIOS[this.#songIndex];
        return TITLE_PREFIX + currentAudio.title + ` (${currentAudio.year})`
    }


    isPlaying()
    {
        return this.#audio.playing();
    }


    async play()
    {
        await this.#audio.play();
        console.log("playing")
    }


    pause()
    {
        this.#audio.pause();
    }


    skipBackwardsOrForward(isForwards, seconds)
    {
        let newPosition = this.#audio.seek() + (isForwards ? seconds : -seconds);
        if (newPosition >= this.#audio.duration())
            newPosition = this.#audio.duration() - 0.1;
        else if (newPosition < 0)
            newPosition = 0;

        this.#audio.seek(newPosition);
    }


    getAudioProgressPercent()
    {
        return this.#audio.seek() / this.#audio.duration();
    }


    setAudioProgressByPercent(percent)
    {
        this.#audio.seek(this.#audio.duration() * percent);
    }


    async moveToNextOrPreviousSong(isNext)
    {
        this.#nowPlaying.textContent = "";

        if (this.#shuffling)
        {
            this.#songIndex = Math.floor(Math.random() * AUDIOS.length);
        }
        else
        {
            this.#songIndex += isNext ? -1 : 1;

            if (this.#songIndex < 0)
                this.#songIndex = AUDIOS.length - 1;
            else if (this.#songIndex === AUDIOS.length)
                this.#songIndex = 0;
        }

        this.#audio.unload();

        const currentAudio = AUDIOS[this.#songIndex];
        await this.#loadSong(AUDIO_PATH + currentAudio.file);
        await this.play();

        this.#nowPlaying.textContent = this.getTitle();
        Visualizer.setSource(this.#audio._sounds[0]._node);
    }


    setShuffling(enabled)
    {
        this.#shuffling = enabled;
    }


    isShuffling()
    {
        return this.#shuffling;
    }


    setLooping(enabled)
    {
        this.#audio.loop(enabled);
    }


    isLooping()
    {
        return this.#audio.loop();
    }
}


export { AudioManager };