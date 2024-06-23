Array.prototype.random = function () {
    return this[Math.floor(Math.random()*this.length)];
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let currentTurn = ["circle", "cross"].random();
let freeze = false;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function InteractableAreaRect(x, y) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.shape;
}

let interactableAreaRectsArray = [];

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawGridLines();
})

window.addEventListener('mousedown', (event) => {
    if (freeze) {
        return;
    }

    
    for (interactableRectsRow of interactableAreaRectsArray) {
        for (rect of interactableRectsRow) {
            if (event.x >= rect.x && 
                event.x <= rect.x+rect.width &&
                event.y >= rect.y &&
                event.y <= rect.y+rect.width &&
                rect.shape === undefined) {
                    context.beginPath();
                    if (currentTurn === 'circle') {
                        rect.shape = 'circle';
                        context.arc(rect.x+75, rect.y+75, 50, 0, Math.PI*2);
                        context.fillStyle = 'blue';
                    }
                    else {
                        rect.shape = 'cross';
                        context.translate(rect.x+30, rect.y+15);
                        context.rotate(Math.PI*90/360);
                        context.roundRect(0, 0, 150, 15, 10);
                        context.resetTransform();

                        context.translate(rect.x+135, rect.y+25);
                        context.rotate(Math.PI*270/360);
                        context.roundRect(0, 0, 150, 15, 10);
                        context.resetTransform();
                        context.fillStyle = 'red';
                    }
                    context.fill();
            }
        }
    }

    if (checkForWin(currentTurn)) {
        showGameText(`${currentTurn[0].toUpperCase() + currentTurn.slice(1)} has won!`);
        currentTurn = ["circle", "cross"].random();
    } else if (isGridFull()) {
        showGameText("It is a draw!", "black");
        currentTurn = ["circle", "cross"].random();
    } else if (currentTurn == "circle") {
        currentTurn = "cross";
    } else {
        currentTurn = "circle";
    }
})

const drawGridLines = () => {
    let initialX = 50;
    let initialY = 50;

    context.clearRect(0, 0, window.innerHeight, window.innerWidth);

    context.beginPath();
    context.roundRect(initialX+150, initialY, 15, 480, 10);
    context.roundRect(initialX+315, initialY, 15, 480, 10);
    context.roundRect(initialX, initialY+150, 480, 15, 10);
    context.roundRect(initialX, initialY+315, 480, 15, 10);

    interactableAreaRectsArray = [
        [
            new InteractableAreaRect(initialX, initialY),
            new InteractableAreaRect(initialX+165, initialY),
            new InteractableAreaRect(initialX+330, initialY)
        ],
        [
            new InteractableAreaRect(initialX, initialY+165),
            new InteractableAreaRect(initialX+165, initialY+165),
            new InteractableAreaRect(initialX+330, initialY+165)
        ],
        [
            new InteractableAreaRect(initialX, initialY+330),
            new InteractableAreaRect(initialX+165, initialY+330),
            new InteractableAreaRect(initialX+330, initialY+330)
        ]
    ];

    context.fillStyle = "black";
    context.fill();
}

const isGridFull = () => {
    let isFull = true;
    for (interactableRectsRow of interactableAreaRectsArray) {
        for (rect of interactableRectsRow) {
            if (rect.shape === undefined) {
                isFull = false;
            }
        }
    }
    return isFull;
}

const checkForWin = (currentShape) => {
    // Horizontal Lines
    if (interactableAreaRectsArray[0][0].shape == currentShape &&
        interactableAreaRectsArray[0][1].shape == currentShape &&
        interactableAreaRectsArray[0][2].shape == currentShape) {
            return true;
    } else if (
        interactableAreaRectsArray[1][0].shape == currentShape &&
        interactableAreaRectsArray[1][1].shape == currentShape &&
        interactableAreaRectsArray[1][2].shape == currentShape) {
            return true;
    } else if (
        interactableAreaRectsArray[2][0].shape == currentShape &&
        interactableAreaRectsArray[2][1].shape == currentShape &&
        interactableAreaRectsArray[2][2].shape == currentShape) {
            return true;
    } else if (
    // Vertical Lines
        interactableAreaRectsArray[0][0].shape == currentShape &&
        interactableAreaRectsArray[1][0].shape == currentShape &&
        interactableAreaRectsArray[2][0].shape == currentShape) {
            return true;
    } else if (
        interactableAreaRectsArray[0][1].shape == currentShape &&
        interactableAreaRectsArray[1][1].shape == currentShape &&
        interactableAreaRectsArray[2][1].shape == currentShape) {
            return true;
    } else if (
        interactableAreaRectsArray[0][2].shape == currentShape &&
        interactableAreaRectsArray[1][2].shape == currentShape &&
        interactableAreaRectsArray[2][2].shape == currentShape) {
            return true;
    } else if (
        // Diagonal Lines
        interactableAreaRectsArray[0][0].shape == currentShape &&
        interactableAreaRectsArray[1][1].shape == currentShape &&
        interactableAreaRectsArray[2][2].shape == currentShape) {
            return true;
    } else if (
        interactableAreaRectsArray[0][2].shape == currentShape &&
        interactableAreaRectsArray[1][1].shape == currentShape &&
        interactableAreaRectsArray[2][0].shape == currentShape) {
            return true;
    } else {
        return false;
    }
}

const showGameText = (text, fillColour) => {
    context.font = "48px Courier New";
    if (fillColour !== undefined) {
        context.fillStyle = fillColour;
    }
    context.fillText(`${text}`, 90, 600);
    freeze = true;
    setTimeout(() => {
        freeze = false;
        drawGridLines();
    }, 2000);
}

drawGridLines();