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
    jumpAvailable: false,
  };

  isInbounds(board, row, col) {
    return ((0 <= row && row < 8) && (0 <= col && col < 8));
  }

  // Kings can go backwards (to greater row values if RED, to lesser if WHITE)
  // A regular piece has 4 spots it could possibly go to while a king has 8
  determineMoves(board, row, col, opponentColor, isKing) {
    const moves = [];
    let jumpValue;
    let rowValue;
    if (opponentColor === 1) {
      rowValue = row - 2;
      jumpValue = row - 1;
    } else {
      rowValue = row + 2;
      jumpValue = row + 1;
    }
    if (this.isInbounds(board, rowValue, col - 2)) {
      if (board[rowValue][col - 2] === 0 && board[jumpValue][col - 1] === opponentColor) {
        moves.push({
          row: rowValue,
          col: col - 2,
          key: `(${rowValue},${col-2})`,
        });
        this.setState((state) => {
          return {
            jumpAvailable: true,
          };
        });
      }
    }
    if (this.isInbounds(board, rowValue, col + 2)) {
      if (board[rowValue][col + 2] === 0 && board[jumpValue][col + 1] === opponentColor) {
        moves.push({
          row: rowValue,
          col: col + 2,
          key: `(${rowValue},${col+2})`,
        });
        this.setState((state) => {
          return {
            jumpAvailable: true,
          };
        });
      }
    }
    if (opponentColor === 1) {
      rowValue = row - 1;
    } else {
      rowValue = row + 1;
    }
    if (!this.state.jumpAvailable) {
      if (this.isInbounds(board, rowValue, col - 1)) {
        if (board[rowValue][col - 1] === 0) {
          moves.push({
            row: rowValue,
            col: col - 1,
            key: `(${rowValue},${col-1})`,
          });
        }
      }
      if (this.isInbounds(board, rowValue, col + 1)) {
        if (board[rowValue][col + 1] === 0) {
          moves.push({
            row: rowValue,
            col: col + 1,
            key: `(${rowValue},${col+1})`,
          });
        }
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
                  available={this.state.possibleMoves.find(move => move.row === y && move.col === x)}
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
                    const prunedMoves = [];
                    // Only add jump moves if a jump is available
                    moves.forEach(move => {
                      if (this.state.jumpAvailable) {
                        if (move.row === y - 2 || move.row === y + 2 || move.col === x - 2 || move.col === x + 2) {
                          prunedMoves.push({
                            row: move.row,
                            col: move.col,
                          });
                        }
                      } else {
                        prunedMoves.push({
                          row: move.row,
                          col: move.col,
                        });
                      }
                    });
                    this.setState((state) => {
                      return {
                        actions: `Selected piece at row ${y}, column ${x}`,
                        possibleMoves: prunedMoves,
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
          <button
            style={{ marginLeft: '10px' }}
            onClick={() => {
              this.setState((state) => {
                return {
                  turn: state.turn === 2 ? 1 : 2,
                  actions: 'No piece selected',
                  possibleMoves: [],
                  jumpAvailable: false,
                };
              });
            }}
          >
            End Turn
          </button>
          <div>
            {this.state.actions}
          </div>
          {this.state.actions !== 'No piece selected' && (
            <div>
              Possible moves:
              {' '}
              {this.state.possibleMoves.length > 0 ? this.state.possibleMoves.map(move => { return (<div>{`(${move.row},${move.col})`}</div>) }) : 'None'}
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
