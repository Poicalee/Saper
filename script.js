document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('game-board');
    const movesCounter = document.getElementById('moves-counter');
    const rowsInput = document.getElementById('new-rows');
    const minesInput = document.getElementById('new-mines');
    const updateForm = document.getElementById('update-form');
    const modal = document.getElementById('result-modal');
    const resultImage = document.getElementById('result-image');
    const resultMessage = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again-button');
    let mineLocations = [];
    let moves = 0;
    let gameOver = false;

    async function initializeBoard(rows) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < 16; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'hidden');
                cell.dataset.row = i;
                cell.dataset.col = j;
	
                board.appendChild(cell);
                // Symulacja opóźnienia za pomocą setTimeout
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    }

  
	function placeMines(mines, rows) {
	  mineLocations = [];
	  for (let i = 0; i < mines; i++) {
		let mineRow, mineCol;
		do {
		  mineRow = Math.floor(Math.random() * rows);
		  mineCol = Math.floor(Math.random() * 16); // Ustawiono stałą wartość 16 kolumn
		} while (mineLocations.some(location => location.row === mineRow && location.col === mineCol));
  
		mineLocations.push({ row: mineRow, col: mineCol });
	  }
	}
	function closeModal() {
		modal.style.display = 'none';
	  }
  
	function revealMines() {
	  mineLocations.forEach(location => {
		const mineCell = document.querySelector(`[data-row="${location.row}"][data-col="${location.col}"]`);
		mineCell.classList.add('mine');
		mineCell.textContent = '💣';
	  });
	}
  
	function revealEmpty(row, col) {
	  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
	  if (!cell || cell.classList.contains('hidden') === false) {
		return;
	  }
  
	  const mineCount = countAdjacentMines(row, col);
	  cell.textContent = mineCount > 0 ? mineCount : '';
  
	  if (mineCount === 0) {
		cell.classList.remove('hidden');
		for (let i = row - 1; i <= row + 1; i++) {
		  for (let j = col - 1; j <= col + 1; j++) {
			revealEmpty(i, j);
		  }
		}
	  } else {
		cell.classList.remove('hidden');
	  }
	}
  
	function countAdjacentMines(row, col) {
	  let count = 0;
	  for (let i = row - 1; i <= row + 1; i++) {
		for (let j = col - 1; j <= col + 1; j++) {
		  if (mineLocations.some(location => location.row === i && location.col === j)) {
			count++;
		  }
		}
	  }
	  return count;
	}
  
	function handleCellClick(event) {
		if (gameOver) {
			return;
		}
	
		const cell = event.target;
		const row = parseInt(cell.dataset.row);
		const col = parseInt(cell.dataset.col);
	
		if (mineLocations.some(location => location.row === row && location.col === col)) {
			revealMines();
			gameOver = true;
			showResult('title1.png', 'Game Over! You hit a mine. Refresh the page to play again :)');
		} else {
			revealEmpty(row, col);
			moves++;
			movesCounter.textContent = `Moves: ${moves}`;
	
			const remainingHiddenCells = document.querySelectorAll('.cell.hidden').length;
			const totalMines = mineLocations.length;
	
			if (remainingHiddenCells === totalMines && moves <= totalMines) {
				revealMines();
				gameOver = true;
				showResult('title2.png', 'Congratulations! You won! Refresh the page to play again :)');
			}
		}
	}
  
	function handleCellRightClick(event) {
	  event.preventDefault();
	  if (gameOver) {
		return;
	  }
  
	  const cell = event.target;
	  cell.classList.toggle('flagged');
	}
  
	function showResult(image, message) {
	  resultImage.src = image;
	  resultMessage.textContent = message;
  
	  // Set the text color to black
	  resultMessage.style.color = 'black';
  
	  modal.style.display = 'block';
	  playAgainButton.style.display = 'block';
	}
  
  
	function addEventListeners() {
	  const cells = document.querySelectorAll('.cell');
	  cells.forEach(cell => {
		cell.addEventListener('click', handleCellClick);
		cell.addEventListener('contextmenu', handleCellRightClick);
	  });
	}
	function updateFormValues(rows, mines) {
        rowsInput.value = rows;
        minesInput.value = mines;
    }

    async function startGame() {
        const rows = parseInt(rowsInput.value);
        const mines = parseInt(minesInput.value);

        await initializeBoard(rows);
        placeMines(mines, rows);
        addEventListeners();
    }

    startGame();

    updateForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const newRows = parseInt(rowsInput.value);
        const newMines = parseInt(minesInput.value);

        // Wyczyszczenie istniejącej planszy z niewielkim opóźnieniem
        await new Promise(resolve => setTimeout(resolve, 500));
        board.innerHTML = '';

        // Aktualizacja gry nowymi wartościami z opóźnieniem
        await initializeBoard(newRows);
        placeMines(newMines, newRows);
        addEventListeners();

        // Aktualizacja wartości formularza
        updateFormValues(newRows, newMines);
    });
	

    playAgainButton.addEventListener('click', function () {
        // Odświeżenie strony
        location.reload();
    });
	document.getElementById('exit-button').addEventListener('click', closeModal);
});
  