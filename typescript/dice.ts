const WINNING_SCORE = 100;

class Player {
    name: string;
    score: number;
    
    constructor(name: string) {
        this.name = name;
        this.score = 0;
    }
}

class Game {
    players: Player[];
    activePlayerIndex: number;
    currDice: number;
    roundScore: number;
    gamePlaying: boolean;

    /**
     * 
     * @param player1Name 
     * @param player2Name 
     */
    constructor(player1Name: string, player2Name: string){
        this.players = [new Player(player1Name), new Player(player2Name)];
        this.activePlayerIndex = 0;
        this.roundScore = 0;
        this.gamePlaying = true;
    }

    generateRandomValue(minValue: number, maxValue: number): number{
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }

    changePlayers(): void{
        //If the active player is Player 1 (index 0)
        if (this.activePlayerIndex === 0) {
            //change the active player to Player 2
            this.activePlayerIndex = 1;
        }
        else {
            //If the active player is Player 2 (index 1)
            this.activePlayerIndex = 0;
        }
        //Reset the round score to 0
        this.roundScore = 0;        
    }

    rollDie(): void {
        if (this.gamePlaying) {
            let dice = this.generateRandomValue(1, 6);
            this.currDice = dice;
            if (dice != 1) {
                this.roundScore += dice;
            }
            else {
                this.changePlayers();
            }
        }
    }

    holdDie(): void {
        if (this.gamePlaying) {
            this.players[this.activePlayerIndex].score += this.roundScore;
            
            if (this.players[this.activePlayerIndex].score >= WINNING_SCORE) {
                this.gamePlaying = false;
                this.gameWinner();
            }
        }
    }

    gameWinner(): string {
        if (this.players[this.activePlayerIndex].score >= WINNING_SCORE && this.gamePlaying == false) {
            return `${this.players[this.activePlayerIndex].name} is the winner. Game Over.`;
        }
        return "";
    }
}

let game: Game;

window.onload = function(){
    let newGameBtn = document.getElementById("new_game") as HTMLButtonElement;
    newGameBtn.onclick = createNewGame;

    (<HTMLButtonElement>document.getElementById("roll")).onclick = rollDie;

    (<HTMLButtonElement>document.getElementById("hold")).onclick = holdDie;

    (<HTMLButtonElement>document.getElementById("reset")).onclick = resetGame;
}

function createNewGame(){
    //set player 1 and player 2 scores to 0

    //verify each player has a name
    //if both players don't have a name display error

    //if both players do have a name start the game!
    let player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    let player2Name = (<HTMLInputElement>document.getElementById("player2")).value;

    if (player1Name && player2Name) {
        game = new Game(player1Name, player2Name);
        (<HTMLElement>document.getElementById("turn")).classList.add("open");
        (<HTMLInputElement>document.getElementById("total")).value = "0";
        (<HTMLInputElement>document.getElementById("die")).value = "0";
        //lock in player names and then change players
        (<HTMLInputElement>document.getElementById("player1")).setAttribute("disabled", "disabled");
        (<HTMLInputElement>document.getElementById("player2")).setAttribute("disabled", "disabled");
        
        //Update the current player's name in the span
        updateCurrentPlayerName();
        
        if (!game.gamePlaying) {
            (<HTMLInputElement>document.getElementById("player1")).removeAttribute("disabled");
            (<HTMLInputElement>document.getElementById("player2")).removeAttribute("disabled");
        }
    }
    
    else {
        //Display Error
        alert("Must enter both player names!")
    }
}

function rollDie():void{

    game.rollDie();
    let currDice = game.currDice;
    let total = game.roundScore;
    
    (<HTMLInputElement>document.getElementById("die")).value = currDice.toString();
    (<HTMLInputElement>document.getElementById("total")).value = total.toString();
    
    updateCurrentPlayerName(); 

    // Update the die animation
    
    
    let dots = getDotsPositions(currDice); // Get positions for the new roll
    
    drawDieFace(dots);
}

function drawDieFace(dots: any) {
    let dieAnimation = document.getElementById("die-animation");
    dieAnimation.innerHTML = '';

    dots.forEach(position => {
        let dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.top = position.top + '%';
        dot.style.left = position.left + '%';
        dieAnimation.appendChild(dot);
    });
}

// Function to get the positions of the dots based on the roll
function getDotsPositions(roll) {
    // Define positions for each possible roll
    const positions = {
        1: [{ top: 40, left: 40 }],
        2: [{ top: 15, left: 15 }, { top: 65, left: 65 }],
        3: [{ top: 15, left: 15 }, { top: 40, left: 40 }, { top: 65, left: 65 }],
        4: [{ top: 15, left: 15 }, { top: 15, left: 65 }, { top: 65, left: 15 }, { top: 65, left: 65 }],
        5: [{ top: 15, left: 15 }, { top: 15, left: 65 }, { top: 40, left: 40 }, { top: 65, left: 15 }, { top: 65, left: 65 }],
        6: [{ top: 15, left: 15 }, { top: 15, left: 40 }, { top: 15, left: 65 }, { top: 65, left: 15 }, { top: 65, left: 40 }, { top: 65, left: 65 }]
    };
    return positions[roll];
}


function holdDie():void{
    
    game.holdDie();
    //get the current turn total
    let currTotal = game.roundScore;

    //determine who the current player is
    let currPlayer = game.activePlayerIndex;
    
    //add the current turn total to the player's total score
    (<HTMLInputElement>document.getElementById("score" + (currPlayer + 1))).value =
            game.players[game.activePlayerIndex].score.toString();
    //reset the turn total to 0
    (<HTMLInputElement>document.getElementById("total")).value = "0";
    (<HTMLInputElement>document.getElementById("die")).value = "0";
    
    let winnerMessage = game.gameWinner();
    if (winnerMessage != "") {
        document.getElementById("winner").textContent = winnerMessage;
    }
    else{
        //change players
        game.changePlayers();
        updateCurrentPlayerName();
    }
    
    
    
}

function updateCurrentPlayerName(): void {
    // Get the current player's name
    let currentPlayerName = game.players[game.activePlayerIndex].name;

    // Update the current player's name in the span
    let currentPlayerSpan = document.getElementById("current") as HTMLElement;
    currentPlayerSpan.innerText = currentPlayerName;
}

function resetGame() {
    //Remove Attribute disable for names
    (<HTMLInputElement>document.getElementById("player1")).removeAttribute("disabled");
    (<HTMLInputElement>document.getElementById("player2")).removeAttribute("disabled");

    //Clear Player name input text
    (<HTMLInputElement>document.getElementById("player1")).value = "";
    (<HTMLInputElement>document.getElementById("player2")).value = "";

    (<HTMLInputElement>document.getElementById("score1")).value = "";
    (<HTMLInputElement>document.getElementById("score2")).value = "";

    (<HTMLElement>document.getElementById("turn")).classList.remove("open");

    game.gamePlaying = true;
    drawDieFace(1);
}