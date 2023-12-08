// classes for tic-tac-math
export {Tile, Board};


class Tile {
    constructor(index) {
        this.index = index;
        this.symbol = '';
        
    }   
    
    tileUnclaimed() {
        return this.symbol === '';
    }

    setSymbol(playerSymbol) {
        if (this.tileUnclaimed()){
            this.symbol = playerSymbol;
        }
        
    }

    resetSymbol(){
        this.symbol = '';
    }

}

class Board {
    constructor(){
        this.tiles = [];
        this.initTiles();       
    }

    initTiles() {
        for (let i = 0; i < 9 ; i++ ){
            this.tiles.push(new Tile(i));
        }
    }

    setTileSym(index, currentPlayer){
        if (index >= 0 && index < 9) {
            this.tiles[index].setSymbol(currentPlayer);
        }
        else {
            throw new Error('Index outside of range');
        }
    }

    getTileSym(index){
        if (index >= 0 && index < 9) {
            return this.tiles[index].symbol;
        }
        else {
            throw new Error('Index outside of range');
        }
    }

    checkWin(){
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
            const winCondition = winningConditions[i];
            const a = this.getTileSym(winCondition[0]);
            const b = this.getTileSym(winCondition[1]);
            const c = this.getTileSym(winCondition[2]);
            if (a === "" || b === "" || c === "") {
              continue;
            }
            if (a === b && b === c) {
              return true;
            }
        }
        return false;
    }

    resetAll(){
        for (let i = 0; i < 9; i++){
            this.tiles[i].resetSymbol();
        }
    }
}
