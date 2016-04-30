var Detail = React.createClass({
  render: function () {
    return (
      <div className="detail">
        <HeaderImage src="../img/beergarden/1/1.jpg" />
      </div>
    );
  }
});

var HeaderImage = React.createClass({
  render: function () {
    return (
      <img src={this.props.src} />
    );
  }
});

ReactDOM.render(
  <Detail />,
  document.getElementById('content')
);
