import update from "react-addons-update";

import Cell from "./cell";

import Board from "../board"

export default React.createClass({
  getInitialState: function() {
    return {
      result: null,
      board: new Board(20,40)
    };
  },
  userPlayedMove: function(i,j,is_flag) {
    var board = this.state.board;
    var result = board.getResultForUserMove(i, j, is_flag);

    this.setState({board: board, result: result});
  },
  render: function() {
    var self = this;

    var icon = ""
    if (this.state.result == "win") {
      icon = <svg viewBox="0 0 72 72" enable-background="new 0 0 72 72"><g><path d="M53,65.9H19.9c-0.4,0-0.7,0.3-0.7,0.7v4.3c0,0.4,0.3,0.7,0.7,0.7H53c0.4,0,0.7-0.3,0.7-0.7v-4.3   C53.7,66.2,53.4,65.9,53,65.9z"/><path d="M68.3,1.8c-0.2-0.6-0.7-1.1-1.3-1.2c-0.6-0.2-1.3,0-1.7,0.4c-0.7,0.6-1.3,1.3-1.8,1.9   c-0.6,0.7-1.3,1.3-1.9,1.9C61.3,5,61,5.2,60.7,5.4c-0.2,0.1-0.4,0-0.4-0.2c0.2-2,0.2-3.5,0.2-4.1c0-0.2-0.2-0.4-0.4-0.4H12.9   c-0.3,0-0.6,0.3-0.6,0.6c0,0.8,0.1,2.5,0.3,4.8l0,0c-0.2-0.1-0.3,0-0.5,0c-0.7-0.3-1.2-0.8-1.6-1.1C9.9,4.2,9.3,3.6,8.6,2.9   C8.1,2.3,7.5,1.6,6.8,1C6.5,0.7,6.1,0.5,5.6,0.5C4.8,0.5,4,1,3.7,1.8c-5.9,17,6.7,29.8,20.4,36.1c0,0,0.1,0,0.1,0   c1.4,1.7,3,3.4,4.7,4.9c1.3,1.1,2.6,2.4,3.5,3.9c2.1,3.5,3.7,9.3-5.1,13.5c-0.2,0.1-0.3,0.3-0.3,0.4l0,2.4c0,0.4,0.3,0.7,0.7,0.7   h17.4c0.4,0,0.7-0.3,0.7-0.7l0-2.4c0-0.2-0.1-0.4-0.3-0.4c-8.8-4.2-7.3-10-5.1-13.5c0.9-1.5,2.2-2.8,3.5-3.9c1.9-1.6,3.5-3.4,5-5.3   c0.1-0.1,0.3-0.3,0.4-0.3C62.5,30.7,74,18.2,68.3,1.8z M6.3,6.5c0-0.2,0.3-0.3,0.4-0.1c0.4,0.4,0.8,0.8,1.3,1.2   c1.1,1,2.8,2.1,4.8,2.3c0.1,0,0.2,0.1,0.2,0.2c0.8,5.7,2.6,13.1,6.2,20.1c0.1,0.2-0.2,0.5-0.4,0.3C12.2,26.2,4.2,18.2,6.3,6.5z    M54,29.4c3.3-6.8,4.9-13.8,5.7-19.3c0-0.1,0.1-0.2,0.3-0.3c1.6-0.4,3-1.3,3.9-2.2c0.4-0.4,0.8-0.7,1.2-1.1   c0.2-0.2,0.5-0.1,0.6,0.2c1.9,10.8-4.9,18.4-11.3,23C54.1,29.9,53.8,29.7,54,29.4z"/></g></svg>;
    } else if (this.state.result == "loss") {
      icon = <svg viewBox="0 0 100 100" enable-background="new 0 0 100 100"><g><path d="M82.9,59.3c-6.1,0.4-18.3-0.4-19.6,0.4c-1.3,0.7-0.4,6.1,5,16.9   C72.4,86,65.1,95.2,61,95c-4.1-0.2-4.3-0.5-4.3-0.5s0.5-16.3-4.5-19.2c-2.4-1.4-6.8-5.7-7.9-8.5c-1.1-2.7-1.6-8-5.3-12.7   c-3.4-9.3-10.8-7.4-10.8-7.4V10.2c0,0,23.5-5.2,35.9-5.2c12.4,0,20.6,2.7,21.9,7.9c1.3,5.2-0.7,5.4,1.3,7.2c2,1.8,4.1,2.7,3.8,5.7   c-0.4,3.1-3,5.7-0.9,7.9c2.2,2.2,2.9,6.5,0.7,8.6c-2.2,2.2,1.6,4.5,2.3,7.4C93.8,52.6,89,58.9,82.9,59.3z M18.4,48h-4.5   c-3.9,0-7.1-2.4-7.1-5.3V13.4c0-2.9,3.2-5.3,7.1-5.3h4.5c3.9,0,7.1,2.4,7.1,5.3v29.3C25.5,45.6,22.3,48,18.4,48z" fill-rule="evenodd" clip-rule="evenodd"/></g></svg>
    }

    return <div className={"minesweeper " + (this.state.result !== null ? "disabled" : "")}>
      <div className="overlay">
        <div className="overlay-content">
          <span>{this.state.result}</span>{icon}
        </div>
      </div>
      <table>
        <tbody>
          {this.state.board.getBoard().map(function(row, i) {
              return <tr key={i}>
                {row.map(function(cell, j) {
                  return <Cell key={i + '-' + j} cell={cell} userPlayedMove={self.userPlayedMove} i={i} j={j} />
                })}
              </tr>
          })}
        </tbody>
      </table>
    </div>;
  }
});
