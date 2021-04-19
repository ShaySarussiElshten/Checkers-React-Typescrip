import Position from './position'

export default interface IInputStatus{
    inputMoveStatus:string
    originPosition?:Position
    targetPosition?:Position
}