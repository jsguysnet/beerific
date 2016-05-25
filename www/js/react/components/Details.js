var BeerGarden = React.createClass({
  render: function () {
    var data = this.props.data || {
      images: [],
      description: null
    };
    
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
    
    if (search) {
      search.substr(1).split('&').forEach(function (part) {
        var param = part.split('=');
        if ('garden' === param[0]) {
          var beerKey = parseInt(param[1]);
          
          Beerific.getData(function (data) {
            if (data.success) {
                data.content.forEach(function (beer) {
                if (beer.id === beerKey) {
                  self.setState({
                    data: beer
                  });
                }
              });
            }
          });
          
          return;
        }
      });
    }
  },
  
  render: function () {
    if (!this._initialized) {
      this._loadData();
      this._initialized = true;
    }
    
    return (
      <div className="app">
        <Header title={this.state.data.title} />
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
        <div className="mobile-col-2-12 center">
          <a href="index.html">
            <i className="fa fa-chevron-left" />
          </a>
        </div>
        <div className="mobile-col-8-12 center">
          <h1>{this.props.title}</h1>
        </div>
        <div className="mobile-col-2-12">
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
          <li className="favorites active">
            <i className="fa fa-star"></i>
          </li>
          <li className="list"></li>
          <li className="settings">
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
    var address = {};
    
    if (this.props.data.hasOwnProperty('location')) {
      address = this.props.data.location.address;
    }
    
    return (
      <div className="summary grid">
        <Feature icon="beer" value="7,80 €" />
        <Feature icon="clock-o" value="24/7" />
        <Address address={address} />
      </div>
    );
  }
});

var Feature = React.createClass({
  render: function () {
    var icon = 'fa fa-' + this.props.icon;
    
    return (
      <div className="mobile-col-1-2">
        <i className={icon}></i>
        <span>{this.props.value}</span>
      </div>
    );
  }
});

var Address = React.createClass({
  render: function () {
    var address = this.props.address || {
      street: null,
      number: null,
      zip: null,
      city: null
    };
    
    return (
      <div className="mobile-grid-1-1 address">
        <p>
          <i className="fa fa-map-marker" />
          <span className="street">{address.street}</span>
          <span className="street-number">{address.number}</span>
          <span className="zip">{address.zip}</span>
          <span className="city">{address.city}</span>
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
