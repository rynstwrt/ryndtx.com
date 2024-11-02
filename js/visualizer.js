const BAR_COLOR = "#f84b15";
const BAR_WIDTH = 2;

const logoContainer = document.querySelector("#logo-container");
const canvas = document.querySelector("#eq-canvas");


class Visualizer
{
    analyser = undefined;
    canvas = undefined;
    canvasContext = undefined;

    
    constructor(audioElement)
    {
        canvas.width = window.innerWidth;

        const audioContext = new AudioContext();
        this.analyser = audioContext.createAnalyser();

        this.canvasContext = canvas.getContext("2d");

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(this.analyser);
        this.analyser.connect(audioContext.destination);
    }
    

    animate()
    {
        window.RequestAnimationFrame = window.requestAnimationFrame(() => this.animate())
            || window.msRequestAnimationFrame(() => this.animate())
            || window.mozRequestAnimationFrame(() => this.animate())
            || window.webkitRequestAnimationFrame(() => this.animate());

        const fbcArray = new Uint8Array(this.analyser.frequencyBinCount);
        const barCount = window.innerWidth / 2;
        this.analyser.getByteFrequencyData(fbcArray);

        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        this.canvasContext.fillStyle = BAR_COLOR;

        for (let i = 0; i < barCount; ++i)
        {
            const barPos = i * 4;
            const barHeight = -(fbcArray[i] / 2);
            this.canvasContext.fillRect(barPos, canvas.height, BAR_WIDTH, barHeight);
        }

        const average = fbcArray.reduce((a, b) => a + b) / fbcArray.length;
        logoContainer.style.transform = `scale(${1 + average / 1000})`;
    }
}


window.addEventListener("resize", () => { canvas.width = window.innerWidth; });


export { Visualizer };