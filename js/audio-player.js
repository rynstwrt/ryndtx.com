import { Visualizer } from "./visualizer.js";


const songs = [];
for (const audio of AUDIOS)
{
    const song = {
        name: audio.title,
        artist: "RynDTX  ",
        url: AUDIO_PATH + audio.file,
        theme: "#FF6600"
    };

    songs.push(song);
}


const aPlayer = new APlayer({
    container: document.querySelector("#music-player"),
    listFolded: false,
    audio: songs.reverse()
});


const visualizer = new Visualizer(aPlayer.audio);
visualizer.animate();
