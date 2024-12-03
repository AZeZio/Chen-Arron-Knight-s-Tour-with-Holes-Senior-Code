// Parts of the program were taken from https://www.geeksforgeeks.org/warnsdorffs-algorithm-knights-tour-problem/ and remade to fit the research problem
// Ran on VSCode

//Sets all possible moves of the knight
const allKnightMoves = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1]
];

// Creates an empty board with 0's as squares and -1's as holes
function makeChessboard(size, holes) {
    const chessboard = Array.from({ length: size }, () => Array(size).fill(0));
    holes.forEach(([x, y]) => {
        // Create holes
         chessboard[x][y] = -1;
    });
    return  chessboard;
}

// Taken from geeksforgeeks.org (Javascript, limits & isempty functions) and remodeled. Ensures that the knight stays on the board and avoids visited squares
function okGo(chessboard, x, y) {
    return x >= 0 && y >= 0 && x < chessboard.length && y < chessboard.length && chessboard[x][y] === 0;
}

// Taken from geeksforgeeks.org (Javascript, getDegree function) and remodeled. Counts the number of onward moves for each possible move in the position. 
// Takes principle from
// Warnsdorff's Rule
function warnsdorffsRule(x, y, size, chessboard, moves) {
    let count = 0;
    for (const [horizontalMove, verticalMove] of moves) {
        // Looks at all potential squares
        const potentialHorizontalMove = x + horizontalMove;
        const potentialVerticalMove = y + verticalMove;
        if (okGo(chessboard, potentialHorizontalMove, potentialVerticalMove)) {
            // Adds one if a potential square is found, repeats for all squares
            count++;
        }
    }
    return count;
}

// Attempts to find a successful knight's tour at (0, 0)
function tourSearch(chessboard, x, y, moveCount, moves, size, holes) {
    if (moveCount === size * size - holes.length) {
        // Tour completed
        return true; 
    }

    // Sorts and filters out the move with the least onward moves
    const nextMoves = moves
        .map(([horizontalMove, verticalMove]) => [x + horizontalMove, y + verticalMove])
        .filter(([potentialHorizontalMove, potentialVerticalMove]) => okGo(chessboard, potentialHorizontalMove, potentialVerticalMove))
        //Finds fewest onward options
        .sort((a, b) => warnsdorffsRule(a[0], a[1], size, chessboard, moves) - warnsdorffsRule(b[0], b[1], size, chessboard, moves));

    // Implements backtracking when the knight can't complete the tour    
    for (const [potentialHorizontalMove, potentialVerticalMove] of nextMoves) {
        // Marks down move
        chessboard[potentialHorizontalMove][potentialVerticalMove] = moveCount + 1; 
        if (tourSearch(chessboard, potentialHorizontalMove, potentialVerticalMove, moveCount + 1, moves, size, holes)) {
            return true;
        }
        // Backtracks
        chessboard[potentialHorizontalMove][potentialVerticalMove] = 0;
    }
    return false;
}

// Starts the knight's tour from a given position
function startTour(chessboard, startX, startY, moves, size, holes) {
    // Starting position value
    chessboard[startX][startY] = 1;
    return tourSearch(chessboard, startX, startY, 1, moves, size, holes);
}

// Generates the inputed amount of random holes
function generateRandomHoles(size, holeCount) {
    const holes = new Set();
    while (holes.size < holeCount) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        holes.add(`${x},${y}`);
    }
    return Array.from(holes).map(hole => hole.split(',').map(Number));
}

// Runs the inputed amount of simulations
function runSimulations(simulations, size, holeCount, moves) {
    const holeTracker = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < simulations; i++) {
        const holes = generateRandomHoles(size, holeCount);
        const chessboard = makeChessboard(size, holes);

        if (startTour(chessboard, 0, 0, moves, size, holes)) {
            holes.forEach(([x, y]) => {
                holeTracker[x][y]++;
            });
        }
    }

    displayHoleTracker(holeTracker);
}

// Displays the results of the hole tracker
function displayHoleTracker(holeTracker) {
    console.log('Hole Success Tracker:');
    console.log(holeTracker.map(row => row.join(' ')).join('\n'));
}

// Control Center
const boardSize = 3;
const holeCount = 4;
const simulations = 2500;

runSimulations(simulations, boardSize, holeCount, allKnightMoves);