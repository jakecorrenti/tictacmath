class Game {
    constructor() {
        this.player1ID = 'X';
        this.player2ID = 'O';
        this.board = new Board();
    }

    startGame() {}
    endGame() {}
    rematch() {}
    playerTurn() {}
    makeMove() {}
    checkProblemAnswer() {}
    generateMathProblem() {}
}

class Square {
    constructor(symbol) {
        this.symbol = '';
    } 

    setSymbol(playerSymbol) {
        this.symbol = playerSymbol;
    }
}

class Board {
    constructor(){
        this.squares = [];
        for (let i = 0; i < 9 ; i++ ){
            this.squares.push(new Square(''));
        }
    }

    squareIsEmpty(index) {
        return this.squares[index].symbol === '';
    }

    setSquareSymbol(index, currentPlayer){
        if (index >= 0 && index < 9) {
            this.squares[index].setSymbol(currentPlayer);
        }
        else {
            throw new Error('Index outside of range');
        }
    }
    
    boardIsEmpty() {
        for (let i = 0; i < 9; i++) {
            if (this.squares[i].symbol !== "") {
                return false;
            }
        }
        return true;
    }

    boardIsFull()  {
        for (let i = 0; i < 9; i++) {
            if (this.squares[i].symbol === "") {
                return false;
            }
        }
        return true;
    }

    hasWinner(){
        /*
           Indexes within the board
           [0] [1] [2]
           [3] [4] [5]
           [6] [7] [8]
        */
        let winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];

        for (let i = 0; i <= 7; i++) {
            const a = this.squares[winningConditions[i][0]].symbol;
            const b = this.squares[winningConditions[i][1]].symbol;
            const c = this.squares[winningConditions[i][2]].symbol;
            if (a === "" || b === "" || c === "") {
              continue;
            }
            if (a === b && b === c) {
              return true;
            }
        }
        return false;
    }

    clearBoard(){
        for (let i = 0; i < 9; i++){
            this.setSquareSymbol(i, '');
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const inputBar = document.querySelector('.problemInput');

    let game = new Game();

    let player1 = game.player1ID;
    let player2 = game.player2ID;
    let currentPlayer = player1;

    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    function handleResultValidation() {
        let roundWon = game.board.hasWinner();

        if (roundWon) {
            announce(currentPlayer === player1 ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (game.board.boardIsFull()) announce(TIE);
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie'
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        game.board.setSquareSymbol(index, currentPlayer);
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            let answer = prompt("Please enter the following problem correctly to draw your symbol:\n3 x 1")
            console.log(answer)

            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        game.board.clearBoard();
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === player2) {
            changePlayer();
        }

        tiles.forEach (tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});
