import React from "react";
import { render } from "react-dom";

class CheckersBoard extends React.Component {
  state = {
    board: [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0]
    ],
    turn: 2,
    actions: 'No piece selected',
    possibleMoves: [],
  };

  isInbounds(board, row, col) {
    return (0 <= row <= 8) && (0 <= col <= 8);
  }

  // Kings can go backwards (to greater row values)
  // A regular piece has 4 spots it could possibly go to while a king has 8
  determineMoves(board, row, col, opponentColor, isKing) {
    const moves = [];
    if (this.isInbounds(board, row-1, col-1)) {
      if (board[row-1][col-1] === 0) {
        moves.push(`(${row-1},${col-1})`);
      }
    }
    if (this.isInbounds(board, row-1, col+1)) {
      if (board[row-1][col+1] === 0) {
        moves.push(`(${row-1},${col+1})`);
      }
    }
    if (this.isInbounds(board, row-2, col-2)) {
      if (board[row-2][col-2] === 0 && board[row-1][col-1] === opponentColor) {
        moves.push(`(${row-2},${col-2})`);
      }
    }
    if (this.isInbounds(board, row-2, col+2)) {
      if (board[row-2][col+2] === 0 && board[row-1][col+1] === opponentColor) {
        moves.push(`(${row-2},${col+2})`);
      }
    }
    // TODO add more cases if piece is a king
    if (isKing) {

    }
    return moves;
  }

  render() {
    const spaceSize = this.props.size / 8;
    const pieceRadius = spaceSize / 2;

    const whoseTurn = `Turn: ${this.state.turn === 2 ? 'Red' : 'White'}`;

    return (
      <div style={{ display: 'flex' }}>
        <svg
          height={this.props.size}
          width={this.props.size}
          viewBox={`0 0 ${this.props.size} ${this.props.size}`}
        >
          {this.state.board.map((row, y) => {
            const isEvenRow = y % 2;
            const spaceY = spaceSize * y;

            return row.map((space, x) => {
              const isEvenSpace = x % 2;
              const spaceX = spaceSize * x;

              return (
                <Space
                  available={this.state.possibleMoves.includes(`(${y},${x})`)}
                  key={x}
                  shade={
                    (isEvenSpace && !isEvenRow) || (!isEvenSpace && isEvenRow)
                  }
                  size={spaceSize}
                  x={spaceX}
                  y={spaceY}
                />
              );
            });
          })}
          {this.state.board.map((row, y) => {
            const spaceY = spaceSize * y;

            return row.map((space, x) => {
              const spaceX = spaceSize * x;

              if (space === 0) {
                // The space is empty.
                return null;
              }

              return (
                <Piece
                  selected={this.state.actions === `Selected piece at row ${y}, column ${x}`}
                  // When a player clicks their own Piece on their own turn
                  // show available spaces for the player to move their Piece
                  showAvailableMoves={() => {
                    const opponentColor = this.state.turn === 1 ? 2 : 1;
                    const moves = this.determineMoves(this.state.board, y, x, opponentColor, false); // TODO replace with real king
                    this.setState((state) => {
                      return {
                        actions: `Selected piece at row ${y}, column ${x}`,
                        possibleMoves: moves,
                      };
                    });
                  }}
                  turn={this.state.turn}
                  key={x}
                  centerX={spaceX + pieceRadius}
                  centerY={spaceY + pieceRadius}
                  player={space}
                  radius={pieceRadius * 0.75}
                />
              );
            });
          })}
        </svg>
        <div style={{ marginLeft: '10px' }}>
          {whoseTurn}
          <button style={{ marginLeft: '10px' }}>
            End Turn
          </button>
          <div>
            {this.state.actions}
          </div>
          {this.state.actions !== 'No piece selected' && (
            <div>
              Possible moves:
              {' '}
              {this.state.possibleMoves.length > 0 ? this.state.possibleMoves : 'None'}
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Space extends React.Component {
  render() {
    let fill;
    if (this.props.available) {
      fill = 'yellow'; 
    } else if (this.props.shade) {
      fill = 'green';
    } else {
      fill = 'lightgray';
    }
    return (
      <rect
        fill={fill}
        height={this.props.size}
        width={this.props.size}
        x={this.props.x}
        y={this.props.y}
      />
    );
  }
}

class Piece extends React.Component {
  render() {
    let isDisabled;
    if ((this.props.turn === 2 && this.props.player === 1) || (this.props.turn === 1 && this.props.player === 2)) {
      isDisabled = true;
    }
    let fill;
    if (this.props.player === 1) {
      fill = this.props.selected ? 'gray' : 'white';
    } else {
      fill = this.props.selected ? 'orange' : 'red';
    }
    return (
      <circle
        cx={this.props.centerX}
        cy={this.props.centerY}
        fill={fill}
        r={this.props.radius}
        onClick={() => {
          if (!isDisabled) {
            this.props.showAvailableMoves();
          }
        }}
      />
    );
  }
}

const container = document.createElement("div");
document.body.appendChild(container);
render(<CheckersBoard size={400} />, container);
