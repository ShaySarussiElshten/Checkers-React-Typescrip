export class HistoryState{
    

    gameState:string[][]
    doubleEatingMode = false

    setGameState(gameState:string[][]){
        this.gameState = gameState
    }

    setDoubleEatingMode(doubleEatingMode: boolean){
        this.doubleEatingMode = doubleEatingMode
    }
 

}