let VIDEO = null;
let CANVAS = null;
let CONTEXT = null;
let SCALER = 1.0;
let SIZE = { x: 0, y: 0, width: 0, height: 0 };
let detector = null;
let timer = 0;
let alertStatus = false;

// change the time to change the fps of the camera
let frame = 100;
// change the time to change the interval of recording
let recordTiming = 10000;

let ITEMS = [];

let mediaRecorder;

function main() {
    console.log("Testing...");

    detector = ml5.objectDetector("cocossd", detectOn);

    CANVAS = document.getElementById("canvas");
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    let promise = navigator.mediaDevices.getUserMedia({
        video: true,
    });
    promise
        .then(function (signal) {
            VIDEO = document.createElement("video");
            VIDEO.srcObject = signal;
            VIDEO.play();

            VIDEO.onloadedmetadata = function () {
                handleReseize();
                window.addEventListener("resize", handleReseize);
                updateCanvas();
                detectObjects();
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
    window.requestAnimationFrame(updateCanvas);
}

function detectOn() {
    detectObjects();
}

function detectObjects() {
    let currentTime = Date.now();
    let timePassed = currentTime - timer;

    if (timePassed >= frame) {
        timer = currentTime;
        detector.detect(CANVAS, loadResult);
    } else {
        let timeLeft = frame - timePassed;
        setTimeout(detectObjects, timeLeft);
    }
}

function loadResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    ITEMS = results;
    drawBox();
    detectObjects();
}

function drawBox() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);

    for (i = 0; i < ITEMS.length; i++) {
        item = ITEMS[i];
        if (item.confidence > 0.1) {
            CONTEXT.strokeStyle = "red";
            CONTEXT.lineWidth = 4;

            CONTEXT.beginPath();
            CONTEXT.rect(item.x, item.y, item.width, item.height);
            CONTEXT.stroke();

            CONTEXT.fillStyle = "red";
            CONTEXT.font = "bold 24px sans-serif";
            CONTEXT.fillText(item.label, item.x + 32, item.y - 5);
        }
    }
}

function alert() {
    alertStatus = !alertStatus;
    console.log("Armed: ", alertStatus);
    if (alertStatus == true) {
        recordLoop();
    }
}

function recordLoop() {
    if (alertStatus == true) {
        if (hashuman()) {
            record();
        } else {
            setTimeout(recordLoop, 1000);
        }

    }
}

function hashuman() {
    return ITEMS.some((item) => item.label === "person");
}

function record() {

    parts = [];
    mediaRecorder = new MediaRecorder(VIDEO.srcObject);
    mediaRecorder.ondataavailable = function (e) {
        parts.push(e.data);
    };

    mediaRecorder.start();

    setTimeout(function () {
        mediaRecorder.stop();
    }, recordTiming);

    mediaRecorder.onstop = function () {
        const blob = new Blob(parts, {
            type: "video/webm",
        });

        date = new Date();
        fileName =
            "RECORDING_" +
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate() +
            "_" +
            date.getHours() +
            "-" +
            date.getMinutes() +
            "-" +
            date.getSeconds() +
            ".webm";

        url = URL.createObjectURL(blob);
        link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    };
}