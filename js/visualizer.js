const BAR_COLOR = "#f84b15";
const logoContainer = document.querySelector("#logo-container");
const BAR_WIDTH = 2;


class Visualizer
{
    static analyser = undefined;
    static canvas = undefined;
    static canvasContext = undefined;


    static init(analyser, canvas)
    {
        Visualizer.analyser = analyser;
        Visualizer.canvas = canvas;
        Visualizer.canvasContext = canvas.getContext("2d");
    }


    static setSource(source)
    {
        Visualizer.analyser = Howler.ctx.createAnalyser();
        source.connect(Visualizer.analyser);
        Visualizer.analyser.connect(Howler.ctx.destination);
    }


    static draw()
    {
        const fbcArray = new Uint8Array(Visualizer.analyser.frequencyBinCount);
        const barCount = window.innerWidth / 2;
        Visualizer.analyser.getByteFrequencyData(fbcArray);

        Visualizer.canvasContext.clearRect(0, 0, Visualizer.canvas.width, Visualizer.canvas.height);
        Visualizer.canvasContext.fillStyle = BAR_COLOR;

        for (let i = 0; i < barCount; ++i)
        {
            const barPos = i * 4;
            const barHeight = -(fbcArray[i] / 2);
            Visualizer.canvasContext.fillRect(barPos, Visualizer.canvas.height, BAR_WIDTH, barHeight);
        }

        const average = fbcArray.reduce((a, b) => a + b) / fbcArray.length;
        logoContainer.style.transform = `scale(${1 + average / 1000})`;
    }
}


export { Visualizer };