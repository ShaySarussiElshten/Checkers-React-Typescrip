import {
    COLOR_PLAYER_ONE,
    COLOR_PLAYER_TWO,
    FAIL,
    SUCCESS, 
    REGULAR_MOVE,
    EATEN_MOVE,
    PLAYER_MUST_EATEN,
    PLAYER_EATEN_OPPONNENT_CHECKER,
    PLAYER_NOT_MUST_EATEN,
    UNDO_OR_REDO,
    PLAYER_CHECKER_MOVE,
    KING_CHCKER 
} from '../utiles/constants'

import {createStringInitialGameState} from '../utiles/stateGameConstants'
import {copyDimensionalArray} from '../utiles/utiles'
import {HistoryState} from '../utiles/historyState'
import {convertBoardtoStringArray,parseBoardString} from '../utiles/utiles'
import { Checker } from './checker'
import IAction from '../interfaces/action'
import IResponeStatus from '../interfaces/responeStatus'
import Iposition from '../interfaces/position'


export class CheckersGame {

    previousBoardActionType =""
    currentGameStatesStack : HistoryState[]
    nextGameStatesStack:HistoryState[] = []
    doubleEatingMode = false
    
    constructor(){
        const historyState = new HistoryState()
        historyState.setGameState(createStringInitialGameState())
        historyState.setDoubleEatingMode(false)
        this.currentGameStatesStack = [historyState]        
    }


    /*
       this funnction is responsible return status object 
       if you have taken any legal move
    */

    public isLegalMove(originPosition:Iposition,targetPosition:Iposition,board:Checker [][],colorCurrentTurn:string):IResponeStatus{
        
       const rowOrigin = originPosition.row
       const colOrigin = originPosition.col
       const rowTarget = targetPosition.row
       const colTarget = targetPosition.col

        
        if(board[rowOrigin][colOrigin] === null)
             return {status:FAIL,message:"your click on origin position is undefined"}
        
 
        if(board[rowOrigin][colOrigin].color !== colorCurrentTurn)
                return {status:FAIL,message:"its not your turn"}

        if (board[rowTarget][colTarget] !== null)
               return {status:FAIL,message:"your click on target position that is not legal"}
        

        if(this.isRegularMove(colorCurrentTurn,originPosition,targetPosition,board)){
               return {status:SUCCESS,type:REGULAR_MOVE}
        }
             
               
        if(this.isEatenMove(originPosition,targetPosition,board,{actionType:"isLegalMove"})){
               return {status:SUCCESS,type:EATEN_MOVE}
        }
            
        
        return {status:FAIL,message:"This is not a legal move"}
    }

    /*
       This function is responsible for making the move on the board 
    */

    public makeMove(originPosition:Iposition,targetPosition:Iposition,gameBoard:Checker [][],setBoard:(board:Checker [][])=>void,moveDetails:IResponeStatus):Checker [][]{

       const rowOrigin = originPosition.row
       const colOrigin = originPosition.col
       const rowTarget = targetPosition.row
       const colTarget = targetPosition.col
       const board = copyDimensionalArray(gameBoard)
       

        if(this.previousBoardActionType === UNDO_OR_REDO){
            this.nextGameStatesStack = []
        }
        
        if(moveDetails.type === REGULAR_MOVE){
             board[rowTarget][colTarget] = board[rowOrigin][colOrigin]
             board[rowOrigin][colOrigin] = null
             setBoard(board)
             return board
        }

        if(moveDetails.type === EATEN_MOVE){
            board[rowTarget][colTarget] = board[rowOrigin][colOrigin]
            board[rowOrigin][colOrigin] = null

            const rowEatenPieceIndex = (rowOrigin + rowTarget) / 2
            const colEatenPieceIndex = (colOrigin + colTarget) / 2
            
            board[rowEatenPieceIndex][colEatenPieceIndex] = null
            setBoard(board)
        }

        this.previousBoardActionType = PLAYER_CHECKER_MOVE
        if(this.doubleEatingMode)
           this.doubleEatingMode = false
        return board
 

    }

    /*
       this funnction is responsible return true/false if the step you took is legal Eaten move
       Eaten move is defined as "jump over the opponent's checkers/players in order to capture/eat them"
    */

    private isEatenMove(originPosition:Iposition,targetPosition:Iposition,board:Checker [][],action:IAction):boolean {
        
        
       const rowOrigin = originPosition.row
       const colOrigin = originPosition.col
       const rowTarget = targetPosition.row
       const colTarget = targetPosition.col
        

        const rowEatenPieceIndex = Math.floor((rowOrigin + rowTarget) / 2)
        const colEatenPieceIndex = Math.floor((colOrigin + colTarget) / 2)

        if(board[rowOrigin][colOrigin] === null || board[rowEatenPieceIndex][colEatenPieceIndex] ===null)
            return false


        if (board[rowOrigin][colOrigin].color === COLOR_PLAYER_ONE && 
            board[rowTarget][colTarget] === null && 
            board[rowEatenPieceIndex][colEatenPieceIndex].color === COLOR_PLAYER_TWO){
                if(rowOrigin + 2 === rowTarget && (colOrigin-2 === colTarget || colOrigin+2 === colTarget)){
                     return true
                }else if(board[rowOrigin][colOrigin].type === KING_CHCKER || action.actionType ==="isHaveDoubleEating" || this.doubleEatingMode){
                    if(rowOrigin - 2 === rowTarget && (colOrigin-2 === colTarget || colOrigin+2 === colTarget))
                        return true
                     
                }
        }
        else if(board[rowOrigin][colOrigin].color === COLOR_PLAYER_TWO && 
                board[rowTarget][colTarget] === null && 
                board[rowEatenPieceIndex][colEatenPieceIndex].color === COLOR_PLAYER_ONE ){
                    if(rowOrigin - 2 === rowTarget && (colOrigin-2 === colTarget || colOrigin+2 === colTarget)){
                         return true
                    }else if(board[rowOrigin][colOrigin].type === KING_CHCKER || action.actionType ==="isHaveDoubleEating" || this.doubleEatingMode){
                        if(rowOrigin + 2 === rowTarget && (colOrigin-2 === colTarget || colOrigin+2 === colTarget))
                            return true
                    } 
        }
       
        return false

    }

    /*
       this funnction is responsible return true/false if the step you took is legal regular move
       regular move is defined as legal diagonal move of some checker
    */

    private isRegularMove(colorCurrentTurn:string,originPosition:Iposition,targetPosition:Iposition,board:Checker [][]):boolean {

       const rowOrigin = originPosition.row
       const colOrigin = originPosition.col
       const rowTarget = targetPosition.row
       const colTarget = targetPosition.col
        
        if(board[rowOrigin][colOrigin].type === KING_CHCKER){
            
            if(rowOrigin + 1 === rowTarget && (colOrigin-1 === colTarget || colOrigin+1 === colTarget))
                  return true; 
            if(rowOrigin - 1 === rowTarget && (colOrigin-1 === colTarget || colOrigin+1 === colTarget))
                  return true;
        }

        if(COLOR_PLAYER_ONE === colorCurrentTurn){
            if(rowOrigin + 1 === rowTarget && (colOrigin-1 === colTarget || colOrigin+1 === colTarget))
                return true;
        }

        if(COLOR_PLAYER_TWO === colorCurrentTurn){
            if(rowOrigin - 1 === rowTarget && (colOrigin-1 === colTarget || colOrigin+1 === colTarget))
                return true;
             
        }

        return false;
    }


    /*
       this funnction is responsible return true/false If 
       there is a state of winning for one of the players
    */

    public checkWinning (board:Checker [][],colorCurrentTurn:string):boolean{
        
        for(let i=0;i<board.length;i++){
          for(let j=0;j<board.length;j++){
            if(colorCurrentTurn === COLOR_PLAYER_ONE){
               if(board[i][j] !== null && board[i][j].color === COLOR_PLAYER_TWO){
                  return false;
               }
            }else{
              if(board[i][j] !== null && board[i][j].color === COLOR_PLAYER_ONE){
                return false;
             }
            }       
          }
        }
    
        return true
        
    }

    
    /*
       this funnction is responsible to push new game state after some move
    */
    public inseetCurrentGameState(board:Checker [][]):void{
        const currentGameMode = copyDimensionalArray(board);
        const stringBoard = convertBoardtoStringArray(currentGameMode)
        const historyState = new HistoryState()
        historyState.setGameState(stringBoard)
        historyState.setDoubleEatingMode(this.doubleEatingMode)
        this.currentGameStatesStack.push(historyState)
    }
 

    /*
       this funnction is responsible to make undo
    */
    public undo (setBoard:(board:Checker [][])=>void,setColorCurrentTurn:(color:string)=>void,colorCurrentTurn:string):IResponeStatus {
         
        if(this.currentGameStatesStack.length ===1)
           return {status:FAIL}

        let indexLastElement = this.currentGameStatesStack.length -1

        const previousHistory =  this.currentGameStatesStack[indexLastElement-1]
        const currentHistory = this.currentGameStatesStack.pop()
        this.nextGameStatesStack.push(currentHistory)
        setBoard(parseBoardString(previousHistory.gameState))
        this.doubleEatingMode = previousHistory.doubleEatingMode
        
        if(!currentHistory.doubleEatingMode){
            setColorCurrentTurn(colorCurrentTurn === COLOR_PLAYER_ONE ? COLOR_PLAYER_TWO : COLOR_PLAYER_ONE)
        }
        
        this.previousBoardActionType = UNDO_OR_REDO
        return {status:SUCCESS}
    
     }

     /*
       this funnction is responsible to make redo
     */
     public redo (setBoard:(board:Checker [][])=>void,setColorCurrentTurn:(color:string)=>void,colorCurrentTurn:string):IResponeStatus{
        
        if(this.nextGameStatesStack.length === 0)
            return {status:FAIL}

        const gameStateHistory = this.nextGameStatesStack.pop()
        this.currentGameStatesStack.push(gameStateHistory)
        setBoard(parseBoardString(gameStateHistory.gameState))
        this.doubleEatingMode = gameStateHistory.doubleEatingMode
        if(!gameStateHistory.doubleEatingMode){
            setColorCurrentTurn(colorCurrentTurn === COLOR_PLAYER_ONE ? COLOR_PLAYER_TWO : COLOR_PLAYER_ONE)
        }
        this.previousBoardActionType = UNDO_OR_REDO
        
        return {status:SUCCESS}
        
   
     }

     /*
       This function is responsible for checking if there is an eating mode 
       that has not been "implemented/done" in the game
     */  
     public isHaveEatingCondition(board:Checker [][],colorCurrentTurn:string,moveDetails:IResponeStatus):IResponeStatus{

        if(moveDetails.status === SUCCESS && moveDetails.type === EATEN_MOVE)
           return {status:FAIL,type:PLAYER_EATEN_OPPONNENT_CHECKER}
        if(this.doubleEatingMode)
           return {status:SUCCESS,type:PLAYER_MUST_EATEN,message:"player must eat the opponent checker\non dooble eating move"}
        
        let eatingActionRuslte
        let originPosition
         
        for(let i=0;i<board.length;i++){
          for(let j=0;j<board.length;j++){
            
            if(board[i][j] !== null && board[i][j].color === COLOR_PLAYER_ONE && colorCurrentTurn === COLOR_PLAYER_ONE){
                
                originPosition = {row:i,col:j}
                eatingActionRuslte = this.tryEatingOpponent(originPosition,board,colorCurrentTurn,{actionType:"isHaveEatingCondition"})
                
                if(eatingActionRuslte.status === SUCCESS)
                    return {status:SUCCESS,type:PLAYER_MUST_EATEN,message:"player must eat the opponent checker"}
                      
                
            }else if(board[i][j] !== null && board[i][j].color === COLOR_PLAYER_TWO && colorCurrentTurn === COLOR_PLAYER_TWO){
                originPosition = {row:i,col:j}
                eatingActionRuslte = this.tryEatingOpponent(originPosition,board,colorCurrentTurn,{actionType:"isHaveEatingCondition"})
                
                if(eatingActionRuslte.status === SUCCESS)
                    return {status:SUCCESS,type:PLAYER_MUST_EATEN,message:"player must eat the opponent checker"}   
            }            
          }
        }
    
        return {status:FAIL,type:PLAYER_NOT_MUST_EATEN}
    }

     /*
       This function is responsible for checking if you can eat your opponent
     */

    private tryEatingOpponent(originPosition:Iposition,board:Checker [][],colorCurrentTurn:string,action:IAction):IResponeStatus{

        let rowOrigin = originPosition.row
        let colOrigin = originPosition.col
        let rowTarget,colTarget
        
        
        if(colorCurrentTurn === COLOR_PLAYER_ONE || board[rowOrigin][colOrigin].type === KING_CHCKER || action.actionType ==="isHaveDoubleEating"){
            
            rowTarget = rowOrigin+2
            colTarget = colOrigin+2

            if(((0<=colTarget) && (colTarget<board.length)) && ((0<=rowTarget) && (rowTarget<board.length))){
                if(this.isEatenMove({row:rowOrigin,col:colOrigin},{row:rowTarget,col:colTarget},board,action))
                    return {status:SUCCESS}
            }
            
            
            rowTarget = rowOrigin+2
            colTarget = colOrigin-2
                 
         
            if(((0<=colTarget) && (colTarget<board.length)) && ((0<=rowTarget) && (rowTarget<board.length))){
                if(this.isEatenMove({row:rowOrigin,col:colOrigin},{row:rowTarget,col:colTarget},board,action))
                    return {status:SUCCESS}
            }
        
        }
        if(colorCurrentTurn === COLOR_PLAYER_TWO || board[rowOrigin][colOrigin].type === KING_CHCKER || action.actionType ==="isHaveDoubleEating"){

            rowTarget = rowOrigin-2
            colTarget = colOrigin+2

            if(((0<=colTarget) && (colTarget<board.length)) && ((0<=rowTarget) && (rowTarget<board.length))){
                if(this.isEatenMove({row:rowOrigin,col:colOrigin},{row:rowTarget,col:colTarget},board,action))
                    return {status:SUCCESS}
            }

            rowTarget = rowOrigin-2
            colTarget = colOrigin-2

            if(((0<=colTarget) && (colTarget<board.length)) && ((0<=rowTarget) && (rowTarget<board.length))){
                if(this.isEatenMove({row:rowOrigin,col:colOrigin},{row:rowTarget,col:colTarget},board,action))
                    return {status:SUCCESS}
            }

        }
            
        return {status:FAIL}

    }


    public makeCheckerKing(gameBoard:Checker [][],setBoard:(board:Checker [][])=>void,colorCurrentTurn:string):Checker [][]{
        
        const board = copyDimensionalArray(gameBoard)
        
        let row;
        if(colorCurrentTurn === COLOR_PLAYER_ONE){
            row = board.length-1
            for(let j=0;j<board.length;j++){
               if(board[row][j] !== null && board[row][j].color === COLOR_PLAYER_ONE && board[row][j].type !== KING_CHCKER){
                    board[row][j].type = KING_CHCKER
                    setBoard(board)
               }
            }
        }else{
            row = 0
            for(let j=0;j<board.length;j++){
               if(board[row][j] !== null && board[row][j].color === COLOR_PLAYER_TWO && board[row][j].type !== KING_CHCKER){
                    board[row][j].type = KING_CHCKER
                    setBoard(board)
               }
            }
        }

        return board
    }

    public isHaveDoubleEating(targetPosition:Iposition,board:Checker [][],colorCurrentTurn:string):boolean{

        const originPosition = targetPosition
        const eatingActionRuslte = this.tryEatingOpponent(originPosition,board,colorCurrentTurn,{actionType:"isHaveDoubleEating"})
                
        if(eatingActionRuslte.status === SUCCESS){
            this.doubleEatingMode = true
            return true
        }
        return false
    
    }



}

