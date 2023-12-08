class Game {
    constructor() {
        this.player1ID = 'X';
        this.player2ID = 'O';
        this.currentPlayer = this.player1ID;
        this.board = new Board();
    }

    startGame() {
        this.player1ID = 'X';
        this.player2ID = 'O';
    }
    endGame() {
        this.player1ID = '';
        this.player2ID = '';
        this.board.clearBoard();
    }

    rematch() {
        this.endGame();
        this.startGame();
    }

    playerTurn() {
        return this.currentPlayera
    }

    makeMove(index, currentPlayer) {
        this.board.setSquareSymbol(index, currentPlayer);
    }

    checkProblemAnswer(multiplicand, multiplier, answer) {
        return (multiplicand * multiplier) == answer;
    }

    generateMathProblem() {
        let multiplicand = Math.floor(Math.random() * 11);
        let multiplier = Math.floor(Math.random() * 11);
        return [multiplicand, multiplier];
    }
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
            if (!this.squareIsEmpty(i)) {
                return false;
            }
        }
        return true;
    }

    boardIsFull()  {
        for (let i = 0; i < 9; i++) {
            if (this.squareIsEmpty(i)) {
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
    const player1AccuracyLabel = document.querySelector('.player1Stats');
    const player2AccuracyLabel = document.querySelector('.player2Stats');
    
    let player1Questions = 0; 
    let player1CorrectAnswers = 0;

    let player2Questions = 0;
    let player2CorrectAnswers = 0;

    let game = new Game();

    let player1 = game.player1ID;
    let player2 = game.player2ID;

    let isGameActive = true;

    function handleResultValidation() {
        if (game.board.boardIsEmpty()) return;
        let roundWon = game.board.hasWinner();

        if (roundWon) {
            announce(game.currentPlayer === player1 ? player1 : player2);
            isGameActive = false;
            return;
        }

        if (game.board.boardIsFull()) announce('TIE');
    }

    const announce = (type) => {
        switch (type) {
            case player2:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case player2:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case 'TIE':
                announcer.innerText = 'Tie'
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === player1 || tile.innerText === player2) {
            return false;
        }

        return true;
    };

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${game.currentPlayer}`);
        game.currentPlayer = game.currentPlayer === player1 ? player2 : player1;
        playerDisplay.innerText = game.currentPlayer;
        playerDisplay.classList.add(`player${game.currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            let isCorrect = false;
            while (!isCorrect) {
                let [multiplicand, multiplier] = game.generateMathProblem();
                let answer = prompt("Please answer the following problem correctly to draw your symbol:\n"+multiplicand+" x "+multiplier).trim();
                isCorrect = game.checkProblemAnswer(multiplicand, multiplier, answer);
                game.currentPlayer === player1 ? player1Questions++ : player2Questions++;
            }

            if (game.currentPlayer === player1) {
                player1CorrectAnswers++;
                player1AccuracyLabel.innerHTML = 'Player X\'s Accuracy: '+ (Math.floor(player1CorrectAnswers / player1Questions * 100))+'%';
            } else {
                player2CorrectAnswers++;
                player2AccuracyLabel.innerHTML = 'Player O\'s Accuracy: '+ (Math.floor(player2CorrectAnswers / player2Questions * 100))+'%';
            }

            tile.innerText = game.currentPlayer;
            tile.classList.add(`player${game.currentPlayer}`);
            game.makeMove(index, game.currentPlayer);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        game.rematch();
        isGameActive = true;
        announcer.classList.add('hide');
        
        player1Questions = 0;
        player1CorrectAnswers = 0;
        player1AccuracyLabel.innerHTML = 'Player X\'s Accuracy: 100%';

        player2Questions = 0;
        player2CorrectAnswers = 0;
        player2AccuracyLabel.innerHTML = 'Player O\'s Accuracy: 100%';

        if (game.currentPlayer === player2) {
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
