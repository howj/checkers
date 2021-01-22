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
    actions: {
      text: 'No piece selected',
      piece: {
        row: -1,
        col: -1,
      },
    },
    possibleMoves: [],
    madeMove: false,
  };

  // Helper function to determine if the row and col examined is within
  // the board limits
  isInbounds(board, row, col) {
    return ((0 <= row && row < 8) && (0 <= col && col < 8));
  }

  // Kings can go backwards (to greater row values if RED, to lesser if WHITE)
  // A regular piece has 4 spots it could possibly go to while a king has 8
  determineMoves(board, row, col, opponentColor, isKing, hasJump) {
    const movesObject = {
      moves: [],
      hasJump: hasJump,
    };
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
      if (board[rowValue][col - 2] === 0 && (board[jumpValue][col - 1] === opponentColor || board[jumpValue][col - 1] === opponentColor * 10)) {
        movesObject.moves.push({
          row: rowValue,
          col: col - 2,
          key: `(${rowValue},${col - 2})`,
          isJump: true,
        });
        movesObject.hasJump = true;
      }
    }
    if (this.isInbounds(board, rowValue, col + 2)) {
      if (board[rowValue][col + 2] === 0 && (board[jumpValue][col + 1] === opponentColor || board[jumpValue][col + 1] === opponentColor * 10)) {
        movesObject.moves.push({
          row: rowValue,
          col: col + 2,
          key: `(${rowValue},${col + 2})`,
          isJump: true,
        });
        movesObject.hasJump = true;
      }
    }
    if (isKing) {
      if (opponentColor === 1) {
        rowValue = row + 2;
        jumpValue = row + 1;
      } else {
        rowValue = row - 2;
        jumpValue = row - 1;
      }
      if (this.isInbounds(board, rowValue, col - 2)) {
        if (board[rowValue][col - 2] === 0 && (board[jumpValue][col - 1] === opponentColor || board[jumpValue][col - 1] === opponentColor * 10)) {
          movesObject.moves.push({
            row: rowValue,
            col: col - 2,
            key: `(${rowValue},${col - 2})`,
            isJump: true,
          });
          movesObject.hasJump = true;
        }
      }
      if (this.isInbounds(board, rowValue, col + 2)) {
        if (board[rowValue][col + 2] === 0 && (board[jumpValue][col + 1] === opponentColor || board[jumpValue][col + 1] === opponentColor * 10)) {
          movesObject.moves.push({
            row: rowValue,
            col: col + 2,
            key: `(${rowValue},${col + 2})`,
            isJump: true,
          });
          movesObject.hasJump = true;
        }
      }
    }
    if (opponentColor === 1) {
      rowValue = row - 1;
    } else {
      rowValue = row + 1;
    }
    if (!movesObject.hasJump && !hasJump) {
      if (this.isInbounds(board, rowValue, col - 1)) {
        if (board[rowValue][col - 1] === 0) {
          movesObject.moves.push({
            row: rowValue,
            col: col - 1,
            key: `(${rowValue},${col - 1})`,
            isJump: false,
          });
        }
      }
      if (this.isInbounds(board, rowValue, col + 1)) {
        if (board[rowValue][col + 1] === 0) {
          movesObject.moves.push({
            row: rowValue,
            col: col + 1,
            key: `(${rowValue},${col + 1})`,
            isJump: false,
          });
        }
      }
    }
    // add more cases if piece is a king
    if (isKing) {
      if (opponentColor === 1) {
        rowValue = row + 1;
      } else {
        rowValue = row - 1;
      }
      if (!movesObject.hasJump && !hasJump) {
        if (this.isInbounds(board, rowValue, col - 1)) {
          if (board[rowValue][col - 1] === 0) {
            movesObject.moves.push({
              row: rowValue,
              col: col - 1,
              key: `(${rowValue},${col - 1})`,
              isJump: false,
            });
          }
        }
        if (this.isInbounds(board, rowValue, col + 1)) {
          if (board[rowValue][col + 1] === 0) {
            movesObject.moves.push({
              row: rowValue,
              col: col + 1,
              key: `(${rowValue},${col + 1})`,
              isJump: false,
            });
          }
        }
      }
    }
    return movesObject;
  }

  render() {
    const spaceSize = this.props.size / 8;
    const pieceRadius = spaceSize / 2;

    const whoseTurn = `Turn: ${this.state.turn === 2 ? 'Red' : 'White'}`;

    let hasJump = false;
    const map = new Map();

    let gameOver = false;

    // Calculate all possible moves for pieces color === turn
    for (let i = 0; i < this.state.board.length; i++) {
      for (let j = 0; j < this.state.board[0].length; j++) {
        if (this.state.board[i][j] === this.state.turn || this.state.board[i][j] === this.state.turn * 10 ) {
          const opponentColor = this.state.turn === 1 ? 2 : 1;
          const movesObject = this.determineMoves(this.state.board, i, j, opponentColor, this.state.board[i][j] > 2, hasJump);
          if (movesObject.hasJump) {
            hasJump = true;
          }
          if (movesObject.moves.length > 0) {
            map.set(`(${i},${j})`, movesObject.moves);
          }
        }
      }
    }
    if (map.size === 0) {
      gameOver = true;
    }

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
                  selectMove={() => {
                    // If the piece we just moved was a king, or the piece
                    // entered the final row, promote it
                    const oldRow = this.state.actions.piece.row;
                    const oldCol = this.state.actions.piece.col;
                    if (this.state.board[oldRow][oldCol] > 2
                      || (this.state.turn === 1 && y === 7)
                      || (this.state.turn === 2 && y === 0)
                    ) {
                      this.state.board[y][x] = this.state.turn * 10;
                    } else {
                      this.state.board[y][x] = this.state.turn;
                    }
                    this.state.board[oldRow][oldCol] = 0;
                    hasJump = true; // set this value, so possibleMoves only contains jumps from this piece
                    const opponentColor = this.state.turn === 1 ? 2 : 1;
                    // if move was just jump, remove the opponent's piece from the board by setting to 0
                    const wasJump = map.get(`(${oldRow},${oldCol})`).find(move => move.isJump);
                    if (wasJump) {
                      this.state.board[(oldRow+y)/2][(oldCol+x)/2] = 0;
                    }
                    const movesObject = this.determineMoves(this.state.board, y, x, opponentColor, this.state.board[y][x] > 2, hasJump);

                    this.setState((state) => {
                      return {
                        possibleMoves: wasJump ? movesObject.moves : [], // if just jumped, and jumps available, then we can move again
                        madeMove: true,
                        actions: {
                          text: `Moved piece to (${y},${x}) from (${oldRow},${oldCol})`,
                          piece: {
                            row: y,
                            col: x,
                          },
                        }
                      };
                    });
                  }}
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
                  isKing={this.state.board[y][x] > 2}
                  isDisabled={(y === this.state.actions.piece.row && x === this.state.actions.piece.col) ? this.state.possibleMoves.length === 0 : this.state.madeMove}
                  selected={this.state.actions.text === `Selected piece at (${y},${x})`}
                  // When a player clicks their own Piece on their own turn
                  // show available spaces for the player to move their Piece
                  showAvailableMoves={() => {
                    const moves = map.get(`(${y},${x})`);
                    let prunedMoves = [];
                    // If there is a jump available, we prune the possible moves by only adding jump moves
                    moves.forEach(move => {
                      if (hasJump) {
                        if (move.isJump) {
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
                        actions: {
                          text: `Selected piece at (${y},${x})`,
                          piece: {
                            row: y,
                            col: x,
                          },
                        },
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
          {gameOver && (
            <div>
              {`Game over. ${this.state.turn === 2 ? 'White' : 'Red'} is the victor`}
            </div>
          )}
          {!gameOver && (
            <>
              {whoseTurn}
              <button
                disabled={!this.state.madeMove || this.state.possibleMoves.length > 0}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  this.setState((state) => {
                    return {
                      madeMove: false,
                      turn: state.turn === 2 ? 1 : 2,
                      actions: {
                        text: 'No piece selected',
                        piece: {
                          row: -1,
                          col: -1,
                        },
                      },
                      possibleMoves: [],
                    };
                  });
                }}
              >
                End Turn
              </button>
              <div>
                {this.state.actions.text}
              </div>
              {this.state.actions.text !== 'No piece selected' && (
                <div>
                  Possible moves:
                  {' '}
                  {this.state.possibleMoves.length > 0 ? this.state.possibleMoves.map(move => { return (<div>{`(${move.row},${move.col})`}</div>) }) : 'None'}
                </div>
              )}
            </>
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
        onClick={() => {
          if (this.props.available) {
            this.props.selectMove();
          }
        }}
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
    let isDisabled = this.props.isDisabled;
    if ((this.props.turn === 2 && this.props.player === 1) || (this.props.turn === 1 && this.props.player === 2)) {
      isDisabled = true;
    }
    let fill;
    if (this.props.player === 1 || this.props.player === 10) {
      fill = this.props.selected ? 'gray' : 'white';
    } else {
      fill = this.props.selected ? 'orange' : 'red';
    }
    if (this.props.isKing) {
      return (
        <circle
          cx={this.props.centerX}
          cy={this.props.centerY}
          fill={fill}
          r={this.props.radius}
          stroke="black"
          strokeWidth="3"
          onClick={() => {
            if (!isDisabled) {
              this.props.showAvailableMoves();
            }
          }}
        />
      );
    }
    if (!this.props.isKing) {
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
}

const container = document.createElement("div");
document.body.appendChild(container);
render(<CheckersBoard size={400} />, container);
