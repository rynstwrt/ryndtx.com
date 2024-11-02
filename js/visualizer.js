const BAR_COLOR = "#f84b15";
const BAR_WIDTH = 2;

const logoContainer = document.querySelector("#logo-container");
const canvas = document.querySelector("#eq-canvas");


class Visualizer
{
    static analyser = undefined;
    static canvas = undefined;
    static canvasContext = undefined;


    static init(audioElement)
    {
        canvas.width = window.innerWidth;

        const audioContext = new AudioContext();
        Visualizer.analyser = audioContext.createAnalyser();

        Visualizer.canvasContext = canvas.getContext("2d");

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(Visualizer.analyser);
        Visualizer.analyser.connect(audioContext.destination);
    }


    static animate()
    {
        window.RequestAnimationFrame = window.requestAnimationFrame(Visualizer.animate)
            || window.msRequestAnimationFrame(Visualizer.animate)
            || window.mozRequestAnimationFrame(Visualizer.animate)
            || window.webkitRequestAnimationFrame(Visualizer.animate);

        const fbcArray = new Uint8Array(Visualizer.analyser.frequencyBinCount);
        const barCount = window.innerWidth / 2;
        Visualizer.analyser.getByteFrequencyData(fbcArray);

        Visualizer.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        Visualizer.canvasContext.fillStyle = BAR_COLOR;

        for (let i = 0; i < barCount; ++i)
        {
            const barPos = i * 4;
            const barHeight = -(fbcArray[i] / 2);
            Visualizer.canvasContext.fillRect(barPos, canvas.height, BAR_WIDTH, barHeight);
        }

        const average = fbcArray.reduce((a, b) => a + b) / fbcArray.length;
        logoContainer.style.transform = `scale(${1 + average / 1000})`;
    }
}


window.addEventListener("resize", () => { canvas.width = window.innerWidth; });


export { Visualizer };