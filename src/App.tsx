import React from 'react';
import './App.css';
import Board from './components/Board/Board'


const App = ()=> {
     
   return (
    <React.Fragment>
       <h1>Checkers Game</h1>
         <Board></Board>
    </React.Fragment>
   )
   
}

export default App;
