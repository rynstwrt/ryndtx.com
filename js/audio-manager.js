class AudioManager
{
    #songIndex = SONGS.length - 1;

    #audio = undefined;

    #shuffling = false;
    #looping = false;


    constructor()
    {
        const latestSong = SONGS[this.#songIndex];
        this.#audio = new Audio(SONGS_PATH + latestSong.file);
        // this.#audio.id = "audio-player";

        this.#audio.onended = async () =>
        {
            if (this.#looping)
                await this.#audio.play();
            else
                await this.#moveToPrevOrNextSong(true);
        }
    }


    isPlaying()
    {
        return !this.#audio.paused;
    }


    async play()
    {
        await this.#audio.play();
    }


    pause()
    {
        this.#audio.pause();
    }


    #moveToPrevOrNextSong(isNext)
    {
        const newSongIndex = (this.#songIndex + (isNext ? 1 : -1)) % SONGS.length;
        console.log("new index");
    }
}