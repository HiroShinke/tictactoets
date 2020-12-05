
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


type SquaresType = (string | null) [];

function calculateWinner(squares : SquaresType ) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 5]
    ];
    for (const [a, b, c] of lines) {
        if (squares[a] &&
            squares[a] === squares[b] &&
            squares[b] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

interface SquareProps {
    onClick : () => void,
    value : string | null
}

function Square(props : SquareProps) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

interface BoardProps {
    onClick : (n: number) => void,
    squares: SquaresType
}

class Board extends React.Component<BoardProps> {

    renderSquare(i: number) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }
    
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

interface GameState {
    history : { squares : SquaresType} [],
    stepNumber : number,
    xIsNext : boolean
}

class Game extends React.Component<unknown,GameState> {

    constructor(props:unknown) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber : 0,
            xIsNext: true,
        };
    }

    handleClick(i:number) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.nextPlayer()
        this.setState({
            history: history.concat([
                { squares: squares }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step:number){
        this.setState(
        {
            history: this.state.history.slice(0,step+1),
            stepNumber : step,
            xIsNext : (step % 2) === 0
        })
    }

    nextPlayer(){
        return this.state.xIsNext ? 'X' : 'O';
    }

    render() {

        const history = this.state.history;
        const current = history[history.length - 1 ];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move)=>{
            const desc = move ? 
                "Go to move #" + move : "Got to game start";
            return <li key={move}>
                        <button 
                            onClick={() => this.jumpTo(move)}
                        >{desc}</button>
                    </li>;
        });

        let status;
        if( winner ){
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.nextPlayer();
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
