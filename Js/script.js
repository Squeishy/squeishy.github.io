// Get the canvas element and its 2D rendering context
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var undoStack = [];
var redoStack = [];

// Set the initial stroke style to red
context.strokeStyle = "red";

// Flag variable to indicate if drawing is in progress
var isDrawing = false;

var repeat = true;

// Variables for spiral drawing
var z = 0; // Controls the shape of the spiral
var colorValue = 0; // Controls the color of the spiral

function setRandomValue() {
    var randomValue = getRandomValue(1, 10);
    document.getElementById("forwardValue").value = randomValue;
    document.getElementById("forwardValueNumber").innerText = randomValue;
    var randomValue = getRandomValue(0, 360);
    document.getElementById("rotationValue").value = randomValue;
    document.getElementById("rotationValueNumber").innerText = randomValue;
    var randomValue = getRandomValue(1, 10);
    document.getElementById("PenSize").value = randomValue;
    document.getElementById("PenSizeValueNumber").innerText = randomValue;
    var randomValue = getRandomValue(600, 1200);
    document.getElementById("Iteration").value = randomValue;
    document.getElementById("IterationValueText").innerText = randomValue;
}

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setRandomValue();

// Function to clear the canvas
function clearCanvas() {
    isDrawing = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    undoStack = [];
    redoStack = [];
}

function undo(){
    if (undoStack.length > 0) {
        redoStack.push(canvas.toDataURL());
        var undoImage = new Image();
        undoImage.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(undoImage, 0, 0);
        };
        undoImage.src = undoStack.pop();
    }
}

function redo(){
    if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL());
        var redoImage = new Image();
        redoImage.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(redoImage, 0, 0);
        };
        redoImage.src = redoStack.pop();
    }
}

function saveCanvasState() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
}

// Function to clear the canvas
function pauseCanvas() {
    isDrawing = false;
}

function downloadImage() {
    // Get the data URL of the canvas
    var dataURL = canvas.toDataURL("image/png");
  
    // Create a temporary link element
    var link = document.createElement("a");
  
    // Set the link's href attribute to the data URL
    link.href = dataURL;
  
    // Set the link's download attribute to specify the filename
    link.download = "spiral.png";
  
    // Programmatically trigger the download
    link.dispatchEvent(new MouseEvent('click'));
}

function drawSpiral() {
    isDrawing = true;
    saveCanvasState();

    // Create an offscreen canvas and its 2D rendering context
    var offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    var offscreenContext = offscreenCanvas.getContext("2d");

    // Set the center coordinates of the offscreen canvas
    var centerX = offscreenCanvas.width / 2;
    var centerY = offscreenCanvas.height / 2;

    // Initialize drawing variables
    var x = centerX;
    var y = centerY;
    var angle = 0;
    var distance = 1
    var increment = parseFloat(document.getElementById("forwardValue").value) || 5; // Get the distance value from an input field
    var lastX = x;
    var lastY = y;
    var shapeAngle = parseFloat(document.getElementById("rotationValue").value) || 120; // Get the shape angle value from an input field

    function drawIteration() {
        if (!isDrawing) {
            return;
        }

        var IterationValue = parseInt(document.getElementById("Iteration").value) || 600;
        offscreenContext.lineWidth = parseFloat(document.getElementById("PenSize").value) || 1;
        offscreenContext.beginPath();
        offscreenContext.moveTo(lastX, lastY);

        var currentTime = performance.now();
        var iterationSpeed = 0.1;

        while (distance < IterationValue && performance.now() - currentTime < iterationSpeed) {
            distance += increment;
            angle += Math.PI / (180) * shapeAngle;
            x = Math.round(x + distance * Math.cos(angle + z)); // Add z value to the angle
            y = Math.round(y + distance * Math.sin(angle + z)); // Add z value to the angle

            // Generate a rainbow color based on the distance traveled
            var rainbowColor = 'hsl(' + (colorValue % 360) + ', 100%, 50%)';
            var saturation = Math.floor(colorValue / IterationValue * 100);
            offscreenContext.strokeStyle = 'hsl(' + (colorValue % 360) + ', ' + saturation + '%, 50%)';
            offscreenContext.strokeStyle = rainbowColor;

            offscreenContext.lineTo(x, y);
            offscreenContext.stroke();

            lastX = x;
            lastY = y;

            increment += 0.1;
        }

        if (distance < IterationValue) {
            colorValue += 20;
            requestAnimationFrame(drawIteration);
        } else {
            z += 0.1;
            context.drawImage(offscreenCanvas, 0, 0);

            if (repeat == true) {
                drawSpiral();
            }
        }
    }

    // Start the spiral drawing process
    drawIteration();
} 

// Event listener for the "Generate" button
document.getElementById("generateButton").addEventListener("click", function () {
    repeat = true;
    drawSpiral();
});

document.getElementById("generateOnceButton").addEventListener("click", function () {
    repeat = false;
    drawSpiral();
});

// Event listener for the "Clear" button
document.getElementById("clearCanvas").addEventListener("click", function () {
    clearCanvas();
});

document.getElementById("pause").addEventListener("click", function () {
    pauseCanvas();
});

document.getElementById("setRandomValue").addEventListener("click", function () {
    setRandomValue();
});

document.getElementById("download").addEventListener("click", function () {
    downloadImage();
});

document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

document.getElementById("redo").addEventListener("click", function () {
    redo();
});

document.getElementById("undo").addEventListener("click", function () {
    undo();
});

// Function to resize the canvas based on the window size
function resizeCanvas() {
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
}


// Call the resizeCanvas function whenever the window is resized
window.addEventListener("resize", resizeCanvas);

function updateForwardValue(value) {
    document.getElementById("forwardValueNumber").innerText = value;
  }

  function updateRotationValue(value) {
    document.getElementById("rotationValueNumber").innerText = value;
  }

  function updatePenSizeValue(value) {
    document.getElementById("PenSizeValueNumber").innerText = value;
  }

  function updateIterationValue(value) {
    document.getElementById("IterationValueText").innerText = value;
  }

// Call the resizeCanvas function initially
resizeCanvas();
