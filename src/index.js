import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ backgroundColor: `${props.bgColor}` }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isWinIndex =
      this.props.winIndex && this.props.winIndex.indexOf(i) !== -1;
    // indexOf 배열 내 요소 찾으면 반환, 발견되지 않으면 -1
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        bgColor={isWinIndex && "pink"}
      />
    );
  }

  render() {
    const array = [0, 1, 2];
    const arrayboard = array.map((a) => {
      return (
        <div className="board-row" key={a}>
          {array.map((i) => {
            return this.renderSquare(a * 3 + i);
          })}
        </div>
      );
    });

    return <div>{arrayboard}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: {
            row: null,
            col: null,
          },
        },
      ],
      orderChanged: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: {
            row: Math.floor(i / 3 + 1),
            col: (i % 3) + 1,
          },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  reverseBtn() {
    this.setState({
      orderChanged: !this.state.orderChanged,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const orderChanged = this.state.orderChanged;
    const moves = history.map((step, move) => {
      // map인자(요소값, 인덱스, 배열)
      const desc = move
        ? "Go to move #" + step.position.row + "." + step.position.col
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={move === this.state.stepNumber ? { fontWeight: "bold" } : {}}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (!orderChanged) {
      moves.reverse();
    }
    const reverseBtn = (
      <button onClick={() => this.reverseBtn()}>
        {orderChanged ? "Desc" : "Asc"}
      </button>
    );

    let status;
    let winIndex;
    if (winner) {
      status = "Winner: " + winner.winner;
      winIndex = winner.winIndex;
    } else if (this.state.stepNumber !== current.squares.length) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Draw game!";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winIndex={winIndex}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{reverseBtn}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winIndex: [a, b, c],
      };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
