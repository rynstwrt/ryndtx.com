const songs = [];

for (const audio of AUDIOS)
{
    const song = {
        name: audio.title,
        artist: "RynDTX  ",
        url: AUDIO_PATH + audio.file,
        lrc: "lrc1.lrc",
        theme: "#FF6600"
    };

    songs.push(song);
}


const aPlayer = new APlayer({
    container: document.querySelector("#music-player"),
    listFolded: false,
    listMaxHeight: 90,
    audio: songs.reverse()
    // audio: [
    //     {
    //         name: "asdf",
    //         artist: "RynDTX",
    //         url: AUDIO_PATH + AUDIOS[0].file,
    //         lrc: "lrc1.lrc",
    //         theme: "#FF6600"
    //     }
    // ]
});