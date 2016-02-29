import _ from 'underscore'

export default class Board {
  constructor(size, bombs, state) {
    this.board = _(size).times(function(i) {
      return _(size).times(function(j) { return {state: "blank", is_bomb: false}; });
    });

    var self = this;
    _(bombs).times(function() {
      while (true) {
        var i = _.random(0, self.board.length - 1);
        var j = _.random(0, self.board.length - 1);
        if (!self.board[i][j].is_bomb) {
          self.board[i][j].is_bomb = true;
          break;
        }
      }
    });
  }

  getBoard() {
    return this.board;
  }

  getCell(i,j) {
    return this.state[i][j];
  }

  updateCellState(value, position) {
    this.state[position[0]][position[1]].state = value;
  }

  toString() {
    var result = "";

    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board.length; j++) {
        switch (this.board[i][j].state) {
          case "blank":
            result += " ■ ";
            break;
          case "flag":
            result += " ⚑ ";
            break;
          case "explodedBomb":
          case "exposedBomb":
            result += " 💣 ";
            break;
          case "count":
            if (this.board[i][j].count == 0) {
              result += "   ";
            } else {
              result += " " + this.board[i][j].count + " ";
            }
            break;
        }
      }
      result += "\n";
    }

    return result;
  }

  getResultForUserMove(i,j,is_flag) {
    if (this.board[i][j].state != "blank") {
      return null;
    }

    if (is_flag) {
      this.board[i][j].state = "flag";
      if (this.userHasWon()) {
        return "win";
      }
    } else {
      if (this.board[i][j].is_bomb) {
        this.board[i][j].state = "explodedBomb";
        this.revealAllBombs();
        return "loss";
      } else {
        this.expandCell(i,j);
      }
    }

    return null;
  }

  userHasWon() {
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board.length; j++) {
        if (this.board[i][j].state != "flag" && this.board[i][j].is_bomb) {
          return false;
        } else if (this.board[i][j].state == "flag" && !this.board[i][j].is_bomb) {
          return false;
        }
      }
    }

    return true;
  }

  expandCell(i,j) {
    this.board[i][j].state = "count";
    this.board[i][j].count = this.getAdjacentBombCount(i,j);

    if (this.board[i][j].count == 0) {
      var self = this;
      this.getAdjacentCells(i,j).forEach(function(cell) {
        if (self.board[cell[0]][cell[1]].state == "blank") {
          self.expandCell.apply(self, cell);
        }
      });
    }
  }

  getAllBlankCells() {
    var result = [];

    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board.length; j++) {
        if (this.board[i][j].state == "blank") {
          result.push([i,j]);
        }
      }
    }

    return result;
  }

  countCellsThatMatchFilter(filter) {
    return this.board
      .map(row => row.filter(filter).length )
      .reduce((sum, x) => sum + x, 0);
  }

  getAdjacentCells(i,j) {
    var result = [];

    var offsets = [1,0,-1];
    var size = this.board.length;

    offsets.forEach(function(offset_i) {
      offsets.forEach(function(offset_j) {
        if (!(offset_i == 0 && offset_j == 0)
            && i + offset_i >= 0 && j + offset_j >= 0
            && i + offset_i < size && j + offset_j < size) {
          result.push([i + offset_i, j + offset_j]);
        }
      });
    });

    return result;
  }

  getAdjacentBombCount(i,j) {
    var count = 0;
    var self = this;

    return this.getAdjacentCells(i,j).filter(function(cell) {
      return self.board[cell[0]][cell[1]].is_bomb
    }).length;
  }

  revealAllBombs() {
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board.length; j++) {
        if (this.board[i][j].state == "blank" && this.board[i][j].is_bomb) {
          this.board[i][j].state = "exposedBomb";
        }
      }
    }
  }

}
