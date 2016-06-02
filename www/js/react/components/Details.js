var BeerGarden = React.createClass({
  render: function () {
    var data = this.props.data || {};
    
    return (
      <div id="details">
        <Images gardenId={data.id} />
        <Address address={data} />
        <Rating value={data.rating} />
        <Info icon="beer" content="7,80 €" />
        <Info icon="clock-o" content="11:00 - 23:00 Uhr" />
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
        <div className="col-11-12">
          {this.props.children}
        </div>
      );
    }
    else {
      return (
        <div className="col-11-12" dangerouslySetInnerHTML={this.parseHtml()} />
      );
    }
  },
  
  render: function () {
    var iconClass = 'fa';
    
    if (!this.props.content && !this.props.children) {
      return (
        <span />
      );
    }
    
    if (this.props.icon) { 
      iconClass += ' fa-' + this.props.icon;
    }
    
    
    return (
      <div className="info clearfix">
        <div className="col-1-12 category-icon">
          <i className={iconClass} />
        </div>
        {this.getContent()}
      </div>
    )
  }
});

var Images = React.createClass({
  render: function () {
    var src = 'img/beergarden/' + this.props.gardenId + '/1.jpg';
    var style = {
      backgroundImage: 'url(' + src + ')'
    };
    
    return (
      <div className="images" style={style} />
    );
  }
});

var Rating = React.createClass({
  render: function () {
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
        <Footer />
      </div>
    );
  }
});

var Header = React.createClass({
  render: function () {
    return (
      <header className="app">
        <div className="col-2-12 button back">
          <a href="index.html">
            <i className="fa fa-chevron-left" />
          </a>
        </div>
        <div className="col-8-12 title">
          <h1>{this.props.title}</h1>
        </div>
        <div className="col-2-12 button favorite">
          <i className="fa fa-heart-o" />
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
