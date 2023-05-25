let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let SCALER = 1.0;
let SIZE = { x: 0, y: 0, width: 0, height: 0 };
let detector = null;
let timer = 0;

function main() {
    console.log("Testing...");

    detector = ml5.objectDetector('cocossd', detectOn);

    CANVAS = document.getElementById("canvas");
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    let promise = navigator.mediaDevices.getUserMedia({ 
        video: true 
        // to configure aspect ratio
        // video:{
        //     width:{exact: 200},
        //     height:{exact: 200},
        // }
    });
    promise
        .then(function (signal) {
            VIDEO = document.createElement("video");
            VIDEO.srcObject = signal;
            VIDEO.play();

            VIDEO.onloadeddata = function () {
                handleReseize();
                window.addEventListener("resize", handleReseize);
                // detectObjects();
                updateCanvas();
            };
        })
        .catch(function (error) {
            alert("Error: " + error);
        });
}

function handleReseize() {
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    let resizer =
        SCALER *
        Math.min(
            window.innerWidth / VIDEO.videoWidth,
            window.innerHeight / VIDEO.videoHeight
        );
    SIZE.width = resizer * VIDEO.videoWidth;
    SIZE.height = resizer * VIDEO.videoHeight;
    SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
    SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
}

function updateCanvas() {
    CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);
    window.requestAnimationFrame(updateCanvas);
}

function detectOn(){
    detectObjects();
}

function detectObjects(){
    let currentTime = Date.now();
    let timePassed = currentTime - timer;
    if(timePassed >= 5000){
        timer = currentTime;
        detector.detect(CANVAS, loadResult);
    }else{
        let timeLeft = 5000 - timePassed;
        setTimeout(detectObjects,timeLeft);
    }
}

function loadResult(error, results){
    if(error){
        console.error(error);
        return;
    }
    console.log(results);
    detectObjects();
}