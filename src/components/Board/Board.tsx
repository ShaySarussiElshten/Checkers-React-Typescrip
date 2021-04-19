import React from 'react';
import './Board.css';
import { useState } from 'react';
import {CheckersGame} from '../../game-classes/checkersGame'
import {Checker} from '../../game-classes/checker'
import blackPlayer from '../../assets/image/black-player.png'
import whitePlayer from '../../assets/image/white-player.png'
import kingBlackPlayer from '../../assets/image/king-black-player.png'
import kingWhitePlayer from '../../assets/image/king-white-player.png'
import {
  COLOR_PLAYER_ONE,
  COLOR_PLAYER_TWO,
  KING_CHCKER,
  FAIL,
  SUCCESS,
  REGULAR_CHCKER,
  EATEN_MOVE

} from '../../utiles/constants'

import {createCheckerClassArray} from '../../utiles/stateGameConstants'
import IInputStatus from '../../interfaces/inputStatus'
import IPosition from '../../interfaces/position'
import IResponeStatus from '../../interfaces/responeStatus'




const Board:React.FC<{}> = ()=> {
   

   const [colorCurrentTurn,setColorCurrentTurn] = useState<string>(COLOR_PLAYER_TWO)
   const [board,setBoard] = useState<Checker[][]>(createCheckerClassArray())
   const [wineer,setWinner] = useState<boolean>(false)
   const [checkersGame,setCheckersGame] = useState<CheckersGame>(new CheckersGame())
   const [originPosition,setOriginPosition] = useState<IPosition | null>(null)
   
  
  /*
    This function is responsible to handle any click on the board
  */
  
   const handleClickBoard = (rowIndex:number,colIndex:number):void => {
    
    if(wineer) 
      return
    
    const {originPosition,targetPosition,inputMoveStatus} = getInputMove(rowIndex,colIndex)
    if(inputMoveStatus === FAIL)
      return 

    const moveDetails = checkersGame.isLegalMove(originPosition,targetPosition,board,colorCurrentTurn)
    
    if(moveDetails.status === FAIL){
       showErrorMessage(moveDetails)
       return
    }

    const eatingConditionDetails = checkersGame.isHaveEatingCondition(board,colorCurrentTurn,moveDetails)
    
    if(eatingConditionDetails.status === SUCCESS){
      showErrorMessage(eatingConditionDetails)
      return
   }
      
    let currentBoardState = checkersGame.makeMove(originPosition,targetPosition,board,setBoard,moveDetails)
    currentBoardState = checkersGame.makeCheckerKing(currentBoardState,setBoard,colorCurrentTurn)

    if(!(moveDetails.type === EATEN_MOVE && checkersGame.isHaveDoubleEating(targetPosition,currentBoardState,colorCurrentTurn))){ 
      setColorCurrentTurn(colorCurrentTurn === COLOR_PLAYER_ONE ? COLOR_PLAYER_TWO : COLOR_PLAYER_ONE)
    }

    checkersGame.inseetCurrentGameState(currentBoardState)
    
    setOriginPosition(null)

    if(checkersGame.checkWinning(currentBoardState,colorCurrentTurn))
      setWinner(true)
    
  }

  /*
    This function is responsible for taking input from the user 
    i.e. originPosition & targetPosition 
    - originPosition defined as a {row , col} object 
    - as well as targetPosition defined as a {row , col} object 
  */

  const getInputMove=(row:number,col:number):IInputStatus =>{
    
    if(!originPosition){
        setOriginPosition({row,col})
        return {inputMoveStatus:FAIL}
    }else{
        const targetPosition = {row,col}
        return {inputMoveStatus:SUCCESS,originPosition,targetPosition}
    }
  }

  /*
    This function is responsible show any error message in game
  */

  const showErrorMessage=(statusObj:IResponeStatus):void=>{
      alert(statusObj.message)
      setOriginPosition(null) 
  }

  /*
    This function is responsible to render checker sqaure on screen
  */
  const renderSquareList = () =>{

    const listSquare = []

    for(let i=0;i<board[0].length;i++){
      const arr = []
      for(let j=0;j<board[0].length;j++){
        arr.push(
          <div key={i+j} 
            onClick={() => handleClickBoard(i,j)} 
            className="square" >
            {
             printChecker(board,i,j)
            }
          </div>
        ) 
      }
      listSquare.push(arr)
    }

    return listSquare
  }

  /*
    This function is responsible to render some checker on screen
  */
  const printChecker =(board:Checker[][],i:number,j:number) =>{
      if(board[i][j] === null)
             return ''
      else{
        if(board[i][j].color === COLOR_PLAYER_ONE){
            if(board[i][j].type === REGULAR_CHCKER){
               return <img src={blackPlayer} width="50px"></img>
            }else if(board[i][j].type === KING_CHCKER){
               return <img src={kingBlackPlayer} width="50px"></img>
            }
        }
        if (board[i][j].color === COLOR_PLAYER_TWO){
          if(board[i][j].type === REGULAR_CHCKER){
              return <img src={whitePlayer} width="50px"></img>
           }else if(board[i][j].type === KING_CHCKER){
              return <img src={kingWhitePlayer} width="50px"></img>
           }
        }
               
      }     
  }

  const undo=()=>{
     const undoStatus = checkersGame.undo(setBoard,setColorCurrentTurn,colorCurrentTurn)
     if(undoStatus.status === FAIL){
      alert('you can\'t undo')
      return
     }
  }

  const redo=()=>{
    const redoStatus = checkersGame.redo(setBoard,setColorCurrentTurn,colorCurrentTurn)
     if(redoStatus.status === FAIL){
      alert('you can\'t redo')
      return
     }
  }

  const startNewGame=()=>{
    setCheckersGame(new CheckersGame())
    setColorCurrentTurn(COLOR_PLAYER_ONE)
    setBoard(createCheckerClassArray())
    setWinner(false)
    setOriginPosition(null)
  }

  
   return (
    <>
      <div className="turn-text">
        <p>current turn color: {colorCurrentTurn}</p>
      </div>
      <div className="board">
         {renderSquareList()}
         {wineer ? <h2 className="winner">{`The final winner: ${colorCurrentTurn === COLOR_PLAYER_ONE ? COLOR_PLAYER_TWO : COLOR_PLAYER_ONE}`}</h2> : null}
         {wineer && <div className="primary-button"  onClick={startNewGame}>Start New Game</div>}
         {!wineer && <div className="primary-button"  onClick={undo}>undo</div>}
         {!wineer &&<div className="primary-button"  onClick={redo}>redo</div>}
      </div> 

    </>
   )
   
}

export default Board;