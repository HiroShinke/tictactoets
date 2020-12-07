
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


type SquaresType = (string | null) [];

function calculateWinner(squares : SquaresType)
: [string|null,number,number,number] | null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
        if (squares[a] &&
            squares[a] === squares[b] &&
            squares[b] === squares[c]) {
            return [squares[a],a,b,c];
        }
    }
    return null;
}

function indexToRowCol(index : number) : [number,number] {
    const mappings : [number,number][] = 
    [[1,1],[1,2],[1,3],
     [2,1],[2,2],[2,3],
     [3,1],[3,2],[3,3]];
    return mappings[index];
}

interface SquareProps {
    onClick : () => void,
    value : string | null,
    style : CSSProperties
}

function Square(props : SquareProps) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
            style={props.style}
        >
            {props.value}
        </button>
    );
}

interface BoardProps {
    onClick : (n: number) => void,
    squares: SquaresType,
    winnerCells : [number,number,number] | null
}

class Board extends React.Component<BoardProps> {

    renderSquare(i: number) {

        let style;
        if( this.props.winnerCells ){
            const [a,b,c] = this.props.winnerCells;
            if (i === a || i === b || i === c )  {
                style = { background : "#ff9" };
            } else {
                style = {};
            }
        } else {
            style = {};
        }
        return <Square
            value={this.props.squares[i]}
            style={style}
            onClick={() => this.props.onClick(i)}
        />;
    }
    
    render() {

        let index = 0;
        const columns = [0,1,2];
        const rows = [0,1,2];

        const createRow = () => {
          const cells = columns.map( (c,i) => {
            return this.renderSquare(index++);
          });
          return <div className="board-row">{cells}</div>;
        };

        const boardRows = rows.map( (row,idx) => {
            return createRow();
        });

        return <div>{boardRows}</div>
    }
}

interface GameState {
    history : { 
        squares : SquaresType,
        move : number | null
    } [],
    stepNumber : number,
    xIsNext : boolean,
    orderAsc : boolean
}

class Game extends React.Component<unknown,GameState> {

    constructor(props:unknown) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move : null
            }],
            stepNumber : 0,
            xIsNext: true,
            orderAsc: true
        };
    }

    handleClick(i:number) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.nextPlayer()
        this.setState({
            history: history.concat([
                { squares: squares,
                  move: i
                } 
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step:number){
        this.setState(
        {
            stepNumber : step,
            xIsNext : (step % 2) === 0
        })
    }

    nextPlayer(){
        return this.state.xIsNext ? 'X' : 'O';
    }

    toggleOrder(){
        this.setState({
            orderAsc: !this.state.orderAsc
        })
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerArray = calculateWinner(current.squares);
        let winner;
        let abc : [number,number,number] | null;
        if( winnerArray ){
            [winner,...abc] = winnerArray;            
        } else {
            winner = null;
            abc = null;
        }
        const moves = history.map((step,idx)=>{
            let  colRowStr;
            if( step.move === null ) {
                colRowStr = "";
             } else {
                const [row,col] = indexToRowCol(step.move);
                colRowStr = `:(${row},${col})`;
            }
            const desc = ( step.move !== null ) ? 
                "Go to move #" + step.move + colRowStr
                : "Got to game start";
            const fontWeight = ( idx === this.state.stepNumber ) ? "bold" : "normal";
            return <li key={step.move}>
                        <button
                            className="history-button"
                            style={ {fontWeight: fontWeight} }
                            onClick={() => this.jumpTo(idx)}
                        >{desc}</button>
                    </li>;
        });

        const moves2 = this.state.orderAsc ? moves : moves.reverse();

        let status;
        if( winner ){
            status = 'Winner: ' + winner;
        } else if( this.state.stepNumber >= 9) {
            status = "Draw!!";
        } else {
            status = 'Next player: ' + this.nextPlayer();
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winnerCells={abc}
                        onClick={(i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={ () => this.toggleOrder() }
                        >toggle step order</button>
                    <ol>{moves2}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
