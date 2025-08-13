// Create Sudoku Board
function createBoard() {
    const table = document.getElementById("sudoku-board");
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("maxlength", "1");
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Check if placing num is safe
function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
        if (board[x][col] === num) return false;
    }
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) return false;
        }
    }
    return true;
}

// Solver function (Backtracking)
function solve(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === ".") {
                for (let num = 1; num <= 9; num++) {
                    let ch = num.toString();
                    if (isSafe(board, row, col, ch)) {
                        board[row][col] = ch;
                        if (solve(board)) return true;
                        board[row][col] = ".";
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Solve Button Action
function solveSudoku() {
    let board = [];
    const rows = document.querySelectorAll("#sudoku-board tr");
    for (let r = 0; r < 9; r++) {
        let row = [];
        const cells = rows[r].querySelectorAll("input");
        for (let c = 0; c < 9; c++) {
            let val = cells[c].value;
            row.push(val === "" ? "." : val);
        }
        board.push(row);
    }
    if (solve(board)) {
        for (let r = 0; r < 9; r++) {
            const cells = rows[r].querySelectorAll("input");
            for (let c = 0; c < 9; c++) {
                cells[c].value = board[r][c];
            }
        }
    } else {
        alert("No solution exists!");
    }
}

// Clear Button Action
function clearBoard() {
    const inputs = document.querySelectorAll("#sudoku-board input");
    inputs.forEach(input => input.value = "");
}

// Create board on page load
createBoard();
// Assign IDs to each input cell for easy navigation
document.querySelectorAll("table input").forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    cell.setAttribute("data-row", row);
    cell.setAttribute("data-col", col);
});

// Add keyboard navigation
document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    if (active.tagName === "INPUT") {
        let row = parseInt(active.getAttribute("data-row"));
        let col = parseInt(active.getAttribute("data-col"));

        if (event.key === "ArrowUp") row = (row - 1 + 9) % 9;
        else if (event.key === "ArrowDown") row = (row + 1) % 9;
        else if (event.key === "ArrowLeft") col = (col - 1 + 9) % 9;
        else if (event.key === "ArrowRight") col = (col + 1) % 9;
        else return; // ignore other keys

        const nextCell = document.querySelector(
            `input[data-row="${row}"][data-col="${col}"]`
        );
        if (nextCell) nextCell.focus();
        event.preventDefault(); // prevent scrolling
    }
});
