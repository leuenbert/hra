console.log("test")

const projectImages = document.querySelectorAll(".overview-project-image");

let container = document.getElementById("container");

// User-defined number of visible squares
let numSquares = projectImages.length;

// Calculate grid dimensions maintaining a 3:2 ratio
const calculateGridDimensions = (num) => {
    const cols = Math.ceil(Math.sqrt(num * (3 / 2))); // Width is 1.5 times larger than height
    const rows = Math.ceil(cols * (2 / 3)); // Height is 2/3 of width
    return { cols, rows };
};

const { cols, rows } = calculateGridDimensions(numSquares);

container.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
container.style.gridTemplateRows = `repeat(${rows}, 50px)`;

// Create a 2D array to track filled squares
const grid = Array.from({ length: rows }, () => Array(cols).fill(false));

// Center coordinates
const centerY = Math.floor(rows / 2);
const centerX = Math.floor(cols / 2);

// Helper function to add a square
const addSquare = (row, col) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.backgroundImage = `url(${projectImages[1].src})`;
    square.style.backgroundSize = "cover";
    square.style.gridRowStart = row + 1;
    square.style.gridColumnStart = col + 1;
    container.appendChild(square);
    grid[row][col] = true;
};

// Add the first square at the center
addSquare(centerY, centerX);

let generatedSquares = 1;

// Flood-fill algorithm with an outer limit of 4 consecutive squares
const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
    [-1, 0], // Up
];

const queue = [[centerY, centerX]];

// Track outer limits
const outerLimits = { top: 0, bottom: 0, left: 0, right: 0 };

const isOuterEdge = (row, col) =>
    row === 0 || row === rows - 1 || col === 0 || col === cols - 1;

const canAddToOuterEdge = (row, col) => {
    if (row === 0) return outerLimits.top < 4;
    if (row === rows - 1) return outerLimits.bottom < 4;
    if (col === 0) return outerLimits.left < 4;
    if (col === cols - 1) return outerLimits.right < 4;
    return true;
};

const incrementOuterLimits = (row, col) => {
    if (row === 0) outerLimits.top++;
    if (row === rows - 1) outerLimits.bottom++;
    if (col === 0) outerLimits.left++;
    if (col === cols - 1) outerLimits.right++;
};

while (generatedSquares < numSquares && queue.length > 0) {
    const [currentRow, currentCol] = queue.shift();

    // Shuffle directions for randomness
    const shuffledDirections = directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of shuffledDirections) {
        const newRow = currentRow + dx;
        const newCol = currentCol + dy;

        // Check if the new position is within bounds and not already filled
        if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            !grid[newRow][newCol]
        ) {
            // Ensure no more than 4 consecutive squares on the edges
            if (isOuterEdge(newRow, newCol) && !canAddToOuterEdge(newRow, newCol)) {
                continue;
            }

            addSquare(newRow, newCol);
            queue.push([newRow, newCol]); // Add the new square to the queue
            generatedSquares++;

            if (isOuterEdge(newRow, newCol)) {
                incrementOuterLimits(newRow, newCol);
            }

            if (generatedSquares === numSquares) break;
        }
    }
}