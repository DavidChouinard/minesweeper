import icons from "../icons";

export default React.createClass({
  onClick: function(event) {
    event.preventDefault();
    if (this.props.cell.state == "blank") {
      this.props.userPlayedMove(this.props.i, this.props.j, event.type == "contextmenu");
    }
  },
  render: function() {
    var src = icons[this.props.cell.state];
    if (this.props.cell.state == "count") {
      src = icons.bombs[this.props.cell.count];
    }

    return <td onClick={this.onClick} onContextMenu={this.onClick} className={this.props.cell.state}>
      <img src={src} alt={this.props.cell.state} />
    </td>;
  }
});
