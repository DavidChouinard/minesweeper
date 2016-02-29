import _ from 'underscore'

import Board from "../app/board"

var TRIES = 1000;
var SIZE = 10;
var MINE_COUNT = 10;

function playGame() {
  var game = new Board(SIZE, MINE_COUNT);

  while (true) {
    var board = game.getBoard();

    // This data structure will be sparse, but it data access simple
    var probabilities = _(SIZE).times(function(i) {
      return _(SIZE).times(function(j) { return []; });
    });

    // For each corner cell, assign a probability to its adjacent cells
    // (number of adjacent cells divided by its count of bomb cells)
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if ("count" in board[i][j] && board[i][j].count > 0) {
          var adjacent = game.getAdjacentCells(i,j);

          var adjacent_bombs_found = adjacent.filter(d => board[d[0]][d[1]].state == "flag" ).length;
          var adjacent_cells_unknown = adjacent.filter(d => board[d[0]][d[1]].state == "blank" ).length;

          for (var index = 0; index < adjacent.length; index++) {
            var cell = adjacent[index];
            if (board[cell[0]][cell[1]].state == "blank") {
              if (board[i][j].count == adjacent_bombs_found + adjacent_cells_unknown) {
                // we assuredly have a bomb
                var result = game.getResultForUserMove(cell[0], cell[1], true);
                if (result !== null) return result;
              } else {
                var probability = (board[i][j].count - adjacent_bombs_found) / adjacent_cells_unknown;
                probabilities[cell[0]][cell[1]].push(probability);
              }
            }
          }
        }
      }
    }

    var bombs_left = MINE_COUNT - game.countCellsThatMatchFilter(d => d.state == "flag" );
    var unknown_cells = game.countCellsThatMatchFilter(d => d.state == "blank" );
    var baseline_probability = bombs_left / unknown_cells;

    var move = [0,0];
    if (unknown_cells != SIZE*SIZE) {  // pick the corner on the first run
      // Find the lowest probability move
      var min_probability = 1;

      for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
          var min = Math.min(...probabilities[i][j]);
          if (min <= min_probability ) {
            min_probability = min;
            move = [i,j];
          }
        }
      }

      // If there are no good moves, pick randomly
      if (min_probability >= baseline_probability) {
        move = _.sample(game.getAllBlankCells());
      }
    }

    var result = game.getResultForUserMove(move[0], move[1], false);
    if (result !== null) return result;
  }
}

function playManyGames() {
  console.log("Playing " + TRIES + " games. (" + SIZE + "x" + SIZE + ")");
  var attempts = _(TRIES).times(playGame);

  console.log("Won:  " + attempts.filter(d => d == "win" ).length + " games.");
  console.log("Lost: " + attempts.filter(d => d == "loss" ).length + " games.");
}

playManyGames();
