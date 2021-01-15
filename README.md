# front-end-interview

Front-End Interview Exercises

## First, Do This

1. Make sure you have [Git](https://www.git-scm.com/) `>= 2.13.2`, [Node.js](https://nodejs.org/en/) `>= 8.6.0` and [Yarn package manager](https://yarnpkg.com/lang/en/) installed on your computer.
1. Fork and clone this repository locally.
1. Run `yarn` to install all the dependencies.
1. Run `yarn start` to start the app in a new browser window (http://localhost:8080/). Each time you save changes to a file, the browser will reload with those changes.

### Checkers

You are given a React app that renders a Checkers board.

Modify [the existing code](https://github.com/Intelight/front-end-interview/blob/master/src/index.js#L105) to create a functional Checkers game, by implementing these user requirements:

1. As a user, I want to move any piece to any space it is allowed to go, so that the board is correctly updated as a result of that move.
   1. If a piece is captured, it is removed from the board.
   1. If a piece reaches the opposite side, it becomes a king.
   1. The "movement" interaction is up to you. It can be with simple mouse clicks, drag-n-drop if you're up for a challenge, or even the keyboard if you wish.
1. As a user, I want to be able to take turns alternating between two local human players, so that Player One takes as many turns as possible and then Player Two does the same and so on until the game ends.
   1. If a player is allowed to make multiple moves, they are allowed to do so before the other player moves again.
   1. If the next player can't make a move or has no more pieces, they lose.

The rules of Checkers are available [here](https://www.wikihow.com/Play-Checkers).

![Screenshot](https://raw.githubusercontent.com/Intelight/front-end-interview/master/screenshot.png)

## Troubleshooting

_Note: This is an incomplete list of errors. Feel free to make a [pull request](https://github.com/Intelight/front-end-interview/pulls) or [add issues](https://github.com/Intelight/front-end-interview/issues) if you run across any bugs or issues_.

### Git Version

`error: cannot spawn .git/hooks/pre-commit: No such file or directory on Windows`

This error is caused by a requirement of [Husky](https://github.com/typicode/husky) to be running git version 2.13.2 or later.

If you see this error on the command line version of git, you can update it by following [these instructions](https://confluence.atlassian.com/bitbucketserver/installing-and-upgrading-git-776640906.html).

If you ran into this error on a git client (such as GitHub Desktop), you may need to update your client as some clients have their own embedded version of git.
