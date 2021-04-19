import { 
  STRING_REP_EMPTY_SQUARE,
  COLOR_PLAYER_ONE,
  REGULAR_CHCKER,
  STRING_REP_REGULAR_BLACK,
  KING_CHCKER,
  STRING_REP_KING_BLACK,
  COLOR_PLAYER_TWO,
  STRING_REP_KING_WHITE,
  STRING_REP_REGULAR_WHITE  
} from './constants' 

import {Checker} from '../game-classes/checker'



export const copyDimensionalArray =(board:Checker[][]):Checker[][]=>{
  
    const array = []

    for(let i=0;i<board.length;i++){
      array.push([...board[i]])
    }
    return array

  }


  export const convertBoardtoStringArray=(board:Checker[][]):string[][]=>{
    
    const boardStringRepresention = []
    
    
    for(let i=0;i<board.length;i++){
        let boardRepresentionRow = []
        for(let j=0;j<board.length;j++){    
               
            if(board[i][j] === null)
                boardRepresentionRow.push(STRING_REP_EMPTY_SQUARE)
            
            else if (board[i][j].color === COLOR_PLAYER_ONE && board[i][j].type === REGULAR_CHCKER)
                boardRepresentionRow.push(STRING_REP_REGULAR_BLACK)
            
            else if (board[i][j].color === COLOR_PLAYER_ONE && board[i][j].type === KING_CHCKER)
                boardRepresentionRow.push(STRING_REP_KING_BLACK)
            
            else if (board[i][j].color === COLOR_PLAYER_TWO && board[i][j].type === REGULAR_CHCKER)
                boardRepresentionRow.push(STRING_REP_REGULAR_WHITE)
            
            else if (board[i][j].color === COLOR_PLAYER_TWO && board[i][j].type === KING_CHCKER)
                 boardRepresentionRow.push(STRING_REP_KING_WHITE)
            
        }
        boardStringRepresention.push(boardRepresentionRow)
    }

    return boardStringRepresention

}

export const parseBoardString=(boardString:string[][]):Checker[][]=>{
        
  const boardCheckers = []     
  
  for(let i=0;i<boardString.length;i++){
      let boardCheckersRow = []
      for(let j=0;j<boardString.length;j++){    
             
          if(boardString[i][j] === STRING_REP_EMPTY_SQUARE){
              boardCheckersRow.push(null)
          } 
          else if (boardString[i][j] === STRING_REP_REGULAR_BLACK){
              boardCheckersRow.push(new Checker(COLOR_PLAYER_ONE,REGULAR_CHCKER))
          }
          else if (boardString[i][j] === STRING_REP_KING_BLACK){
              boardCheckersRow.push(new Checker(COLOR_PLAYER_ONE,KING_CHCKER))
          }
          else if (boardString[i][j] === STRING_REP_REGULAR_WHITE){
              boardCheckersRow.push(new Checker(COLOR_PLAYER_TWO,REGULAR_CHCKER))
          }
          else if (boardString[i][j] === STRING_REP_KING_WHITE){
              boardCheckersRow.push(new Checker(COLOR_PLAYER_TWO,KING_CHCKER))
          }

      }
      boardCheckers.push(boardCheckersRow)
  }

  return boardCheckers

}