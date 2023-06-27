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
let recordTiming = 5000;

let ITEMS = [];

function main() {
  console.log("Testing...");

  detector = ml5.objectDetector("cocossd", detectOn);

  CANVAS = document.getElementById("canvas");
  CONTEXT = CANVAS.getContext("2d");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  let promise = navigator.mediaDevices.getUserMedia({
    video: true,
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
  console.log(ITEMS);
  drawBox();
  detectObjects();
}

function drawBox() {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  // console.log("Canvas Dimensions: ", CANVAS.width, CANVAS.height);
  CONTEXT.drawImage(VIDEO, SIZE.x, SIZE.y, SIZE.width, SIZE.height);

  for (i = 0; i < ITEMS.length; i++) {
    item = ITEMS[i];
    if (item.confidence > 0.5) {
      CONTEXT.strokeStyle = "red";
      CONTEXT.lineWidth = 4;

      CONTEXT.beginPath();
      // CONTEXT.rect(X, Y, W, H);
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
    record();
  }
}

function hashuman(){
  return ITEMS.some(item => item.label === "person");
}

function record() {
  if (alertStatus && hashuman() == true) {
    console.log("Snap!");
    html2canvas(document.body, { willReadFrequently: true }).then(function (canvas) {
      const base64image = canvas.toDataURL("image/png");
      date = new Date();
      fileName =
        "IMAGE_" +
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
        ".png";
      link = document.createElement("a");
      link.href = base64image;
      link.download = fileName;
      link.click();
    });
    setInterval(record, recordTiming);
  }
}