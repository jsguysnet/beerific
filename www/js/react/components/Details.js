var BeerGarden = React.createClass({
  render: function () {
    var data = this.props.data || {};
    
    return (
      <div id="details">
        <Images images={data.images} />
        <Summary data={data} />
        <Description text={data.description} />
      </div>
    );
  }
});

var Details = React.createClass({
  _initialized: false, 
  
  getInitialState: function () {
    return {
      data: {}
    };
  },
  
  _loadData: function () {
    var self = this;
    
    var search = window.location.search || '?garden=1';
    
    search.substr(1).split('&').forEach(function (part) {
      var param = part.split('=');
      if ('garden' === param[0]) {
        var beerKey = parseInt(param[1]);
        var filter = {};
        
        Beerific.getDataset('v_beergarden_details', beerKey, function (data) {
          self.setState({
            data: data
          });
        });
        
        return;
      }
    });
  },
  
  render: function () {
    if (!this._initialized) {
      this._loadData();
      this._initialized = true;
    }
    
    return (
      <div>
        <Header title={this.state.data.label} />
        <BeerGarden data={this.state.data} />
        <Footer />
      </div>
    );
  }
});

var Header = React.createClass({
  render: function () {
    return (
      <header className="app">
        <div className="col-2-12 back">
          <a href="index.html">
            <i className="fa fa-chevron-left" />
          </a>
        </div>
        <div className="col-8-12 title">
          <h1>{this.props.title}</h1>
        </div>
        <div className="col-2-12">
          &nbsp;
        </div>
      </header>
    );
  }
});

var Footer = React.createClass({
  render: function () {
    return (
      <footer>
        <ul className="tab-navigation">
          <li className="favorites col-1-3">
            <i className="fa fa-star"></i>
          </li>
          <li className="list col-1-3 active"></li>
          <li className="settings col-1-3">
            <i className="fa fa-cog"></i>
          </li>
        </ul>
      </footer>
    );
  }
})

var Images = React.createClass({
  render: function () {
    var images = this.props.images || [];
    var image = images[0] ? images[0] : {
      src: '',
      alt: 'Wir haben noch kein Bild von diesem Biergarten'
    };
    var style = {
      backgroundImage: 'url(' + image.src + ')'
    };
    
    return (
      <div className="images" style={style} />
    );
  }
});

var Summary = React.createClass({
  render: function () {
    return (
      <div className="summary grid">
        <Rating value={this.props.data.rating} />
        <Feature icon="beer" value="7,80 €" />
        <Feature icon="clock-o" value="24/7" />
        <Address address={this.props.data} />
      </div>
    );
  }
});

var Feature = React.createClass({
  render: function () {
    var icon = 'fa fa-' + this.props.icon;
    
    return (
      <div className="col-1-2">
        <i className={icon}></i>
        <span>{this.props.value}</span>
      </div>
    );
  }
});

var Rating = React.createClass({
  render: function () {
    return (
      <div className="rating">
        <i className="fa fa-star" />
        <i className="fa fa-star" />
        <i className="fa fa-star-half-o" />
        <i className="fa fa-star-o" />
        <i className="fa fa-star-o" />
      </div>
    )
  }
});

var Address = React.createClass({
  render: function () {
    var data = this.props.address || {};
    
    return (
      <div className="address">
        <p>
          <i className="fa fa-map-marker" />
          <span className="street">{data.street}</span>
          <span className="street-number">{data.housenumber}</span>
        </p>
        <p>
          <i className="fa" />
          <span className="zip">{data.zip}</span>
          <span className="city">{data.city}</span>
        </p>
      </div>
    );
  }
});

var Description = React.createClass({
  rawMarkUp: function () {
    return {__html: marked(this.props.text || '')};
  },
  
  render: function () {
    return (
      <div className="description">
        <span dangerouslySetInnerHTML={this.rawMarkUp()} />
      </div>
    );
  }
});

ReactDOM.render(
  <Details />,
  document.getElementById('content')
);
