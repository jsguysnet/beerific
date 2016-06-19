var BeerGarden = React.createClass({
  render: function () {
    var data = this.props.data || {};

    return (
      <div id="details">
        <Images gardenId={data.id} />
        <Shortcuts data={data} />
        <Map data={data} />
        <Address address={data} />
        <Rating value={data.rating} />
        <Info icon="info" content={data.description} />
      </div>
    );
  }
});

var Info = React.createClass({
  parseHtml: function () {
    var content = this.props.content || '';
    
    if (content.match(/<.+>/)) {
      return {__html: marked(content || '')};
    }
    else {
      return {__html: content};
    }
  },
  
  getContent: function () {
    if (this.props.children) {
      return (
        <div className="content">
          {this.props.children}
        </div>
      );
    }
    else {
      return (
        <div className="content" dangerouslySetInnerHTML={this.parseHtml()} />
      );
    }
  },
  
  render: function () {
    var icon = null;
    
    if (!this.props.content && !this.props.children) {
      return (
        <span />
      );
    }
    
    if (this.props.icon) { 
      var iconClass = 'category-icon fa fa-' + this.props.icon;
      icon = <i className={iconClass} />;
    }

    var className = 'info clearfix';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    
    return (
      <div className={className}>
        {icon}
        {this.getContent()}
      </div>
    )
  }
});

var Map = React.createClass({
  render: function () {
    return (
      <Info className="fullscreen map-canvas">
        <i className="background-icon fa fa-map" />
        <div ref="map-canvas" />
      </Info>
    );
  },

  componentDidUpdate: function () {
    var self = this;

    var coordinates = {
      lat: self.props.data.latitude,
      lng: self.props.data.longitude,
    };

    if (!coordinates.lat) {
      return;
    }

    var map = new google.maps.Map(self.refs['map-canvas'], {
      center: coordinates,
      scrollwheel: false,
      zoom: 15
    });

    var marker = new google.maps.Marker({
      map: map,
      position: coordinates,
      title: self.props.data.label
    });
  }
});

var Images = React.createClass({
  render: function () {    
    return (
      <img className="images" ref="image" />
    );
  },

  componentDidUpdate: function () {
    if (this.props.gardenId) {
      var image = $(this.refs.image);
      var src = 'http://api.beerific.jsguys.net/beergarden/' +
        this.props.gardenId + '/1.jpg';
      image.attr('src', src).load(function () {
        image.addClass('loaded');
      });
    }
  }
});

var Rating = React.createClass({
  render: function () {
    if (!this.props.rating) {
      return (<span />);
    }

    return (
      <Info>
        <div className="rating">
          <i className="fa fa-star" />
          <i className="fa fa-star" />
          <i className="fa fa-star" />
          <i className="fa fa-star-o" />
          <i className="fa fa-star-o" />
        </div>
      </Info>
    )
  }
});

var Address = React.createClass({  
  render: function () {
    var data = this.props.address || {};
    var address = null;
    
    if (data.street) {
      address = data.street + ' ' + data.housenumber + '<br>' +
        data.zip + ' ' + data.city;
    }
    
    return (
      <Info icon="map-marker" content={address} />
    );
  }
});

var Details = React.createClass({
  _initialized: false, 
  
  getInitialState: function () {
    return {
      data: {
        label: null
      }
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
      </div>
    );
  }
});

var Shortcuts = React.createClass({
  render: function () {
    var url = {
      facebook: ''
    };

    return (
      <Info className="no-icon shortcuts clearfix">
        <div className="shortcut">
          <i className="fa fa-map" />
        </div>
        <div className="shortcut">
          <a href={url.facebook} target="_blank">
            <i className="fa fa-facebook" />
          </a>
        </div>
        <div className="shortcut">
          <i className="fa fa-twitter" />
        </div>
        <div className="shortcut">
          <i className="fa fa-whatsapp" />
        </div>
      </Info>
    );
  }
});

var Header = React.createClass({
  render: function () {
    return (
      <header className="app">
        <div className="button back">
          <a href="index.html">
            <i className="fa fa-chevron-left" />
          </a>
        </div>
        <div className="title">
          <h1>{this.props.title}</h1>
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


ReactDOM.render(
  <Details />,
  document.getElementById('content')
);
