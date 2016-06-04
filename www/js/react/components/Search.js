/* Component Search */
var Search = React.createClass({
    render: function () {
        return (
            <div className="cmp-beergarden-search-page">
                <FilterableBeergardenList />
                <LoadingOverlay />
            </div>
        );
    }
});

/* Component FilterableBeergardenList */
var FilterableBeergardenList = React.createClass({
    getInitialState: function () {
        return {
            items: null
        }
    },

    handleInputChange: function (obj, refresh) {
        var self = this;
        console.log(obj);

        refresh = !!refresh;

        self.filter(obj, refresh);
    },

    filter: function (obj, refresh) {
        var self = this;

        Beerific.getData(obj, refresh, function (data) {
            data = data.filter(function (item) {
                if (obj.text) {
                    var regex = new RegExp(obj.text, 'i');
                    return -1 !== item.label.search(regex);
                }

                return true;
            });

            $('.cmp-loading-overlay').hide();

            self.setState({
                items: data
            });
        });
    },

    render: function () {
        return (
            <div className="cmp-filterable-beergarden-list">
                <SearchForm onInputChange={this.handleInputChange}/>
                <BeergardenFilterOverlay onInputChange={this.handleInputChange}/>
                <BeergardenList data={this.state.items}/>
            </div>
        );
    }
});

/* Component SearchForm */
var SearchForm = React.createClass({
    handleChange: function () {
        this.props.onInputChange({
            text: this.refs.filterText.value
        });
    },

    handleReload: function () {
        this.refs.filterText.value = '';
        this.props.onInputChange({
            text: this.refs.filterText.value
        }, true);
    },

    handleFilter: function () {
        $('.cmp-beergarden-filter-overlay').show();
    },

    handleSubmit: function (event) {
        event.preventDefault();
        return false;
    },

    render: function () {
        return (
            <div className="cmp-search-form">
                <form action="#" className="search grid" onSubmit={this.handleSubmit}>
                    <i className="fa fa-search magnify"></i>
                    <input className="col-9-12 filter-search-field"
                           onChange={this.handleChange}
                           value={this.props.filterText}
                           ref="filterText"
                           type="text"
                           placeholder="Biergarten finden..." />
                    <i className="handle-filter fa fa-sliders" onClick={this.handleFilter}></i>
                    <i className="handle-reload fa fa-refresh" onClick={this.handleReload}></i>
                </form>
            </div>
        );
    }
});

/* Component BeergardenFilterOverlay */
var BeergardenFilterOverlay = React.createClass({
    handleAbort: function () {
        $('.cmp-beergarden-filter-overlay').hide();
    },

    handleOK: function () {
        var self = this;

        var radius = parseFloat($('input.filter-radius').val());
        var limit = parseInt($('input.filter-search-field').val());
        var text = $('input.filter-search-field').val();

        $('.cmp-beergarden-filter-overlay').hide();

        self.props.onInputChange({
            radius: radius,
            text: text,
            limit: limit
        }, true);
    },

    render: function () {
        return (
            <div className="cmp-beergarden-filter-overlay overlay">
                <div className="cmp-filter">
                    <div className="inner">
                        <h2><i className="fa fa-sliders"></i>Filter anwenden</h2>
                        <Slider name="radius"
                                label="Umkreis"
                                unit="km"
                                min="0"
                                max="50"
                                precision="1" />
                        <div className="action-buttons">
                            <button onClick={this.handleAbort} className="filter-cancel align-left">Abbrechen</button>
                            <button onClick={this.handleOK} className="filter-submit align-right">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

/* Component Slider */
var Slider = React.createClass({
    componentDidMount: function () {
        var self = this;

        var slider = $('#range-slider-' + self.props.name);
        self._startPx = slider.offset().left;
        self._endPx = slider.outerWidth() - $('.cmp-slider').width();
        self._step = 100 / slider.outerWidth();

        $('.cmp-beergarden-filter-overlay').hide();
        $('.cmp-beergarden-filter-overlay').css('visibility', 'visible');
    },

    getInitialState: function () {
        var self = this;

        return {
            range: 0,
            moveable: false,
            sliderValue: parseInt(self.props.min)
        };
    },

    activateMove: function (event) {
        var self = this;
        event.preventDefault();

        self.setState({
            moveable: true,
            range: self.state.range,
            sliderValue: self.state.sliderValue
        });
    },

    deactivateMove: function (event) {
        var self = this;
        event.preventDefault();

        self.setState({
            moveable: false,
            range: self.state.range,
            sliderValue: self.state.sliderValue
        });
    },

    handleClick: function (event) {
        var self = this;
        event.preventDefault();

        self.handleMove(event, true);
    },

    handleMove: function (event, click) {
        var self = this;
        event.preventDefault();

        if (self.state.moveable || click) {
            event.persist();

            var pos = (event.touches ? event.touches[0].clientX : event.clientX) - self._startPx;

            pos = pos < 0 ? 0 : pos;

            if (pos > self._endPx) {
                pos = self._endPx;
            }

            var slider = $('#range-slider-' + self.props.name + ' .cmp-slider');
            var sliderValue = parseInt(self.props.min) + (self.state.range / self._endPx) * parseInt(self.props.max);

            var precision = Math.pow(10, parseInt(self.props.precision));

            self.setState({
                moveable: !click,
                range: pos,
                sliderValue: parseInt(sliderValue * precision) / precision
            });
        }
    },

    render: function () {
        var self = this;
        var slider = $('#range-slider-' + self.props.name + ' .cmp-slider');

        slider.css('left', self.state.range * self._step + '%');

        return (
           <div className="cmp-range"
                onMouseMove={this.handleMove}
                onMouseUp={this.deactivateMove}
                onMouseDown={this.activateMove}
                onClick={this.handleClick}
                onTouchMove={this.handleMove}
                onTouchEnd={this.deactivateMove}
                onTouchStart={this.activateMove}>
               <div className="grid">
                   <label className="col-8-12">{self.props.label}</label>
                   <span className="range-value col-4-12 no-padding align-right">{self.state.sliderValue + ' ' + self.props.unit}</span>
                   <input type="hidden" className={'filter-' + self.props.name} name={'filter-' + self.props.name} value={self.state.sliderValue} />
               </div>
               <div id={'range-slider-' + self.props.name} className="cmp-range-slider grid">
                   <span className="cmp-slider"></span>
                   <span className="range-slider-start col-1-2 ">{self.props.min + ' ' + self.props.unit}</span>
                   <span className="range-slider-end col-1-2 no-padding align-right">{self.props.max + ' ' + self.props.unit}</span>
               </div>
           </div>
       );
   }
});

/* component BeerGardenList */
var BeergardenList = React.createClass({
    getInitialState: function () {
        return {
            items: []
        };
    },

    componentDidMount: function () {
        var self = this;

        if (null === Beerific._data) {
            window.setTimeout(function () {
                self.componentDidMount();
            }, 500);

            return;
        }

        this.filter();
    },

    filter: function (search) {
        var self = this;

        Beerific.getData(search, false, function (data) {
            $('.cmp-loading-overlay').hide();
            self.setState({items: data});
        });
    },

    render: function () {
        if (0 === this.state.items.length) {
            return null;
        }

        var items = this.props.data || this.state.items;

        return (
            <ul className="cmp-beergarden-list">
                {
                    items.map(function (item) {
                        return (
                            <Beergarden
                                key={item.id}
                                id={item.id}
                                title={item.label}
                                status={item.status}
                                teaser={item.teaser}
                                distance={item.distance} />
                        );
                    })
                }
            </ul>
        );
    }
});

/* component BeerGarden */
var Beergarden = React.createClass({
    getInitialState: function () {
        return { active: false };
    },

    handleClick: function (event) {
        var detailedLink = 'details.html?garden=' + this.props.id;
        location.href = detailedLink;
    },

    render: function () {
        var beerGardenCls = 'cmp-beergarden ' + this.props.status;
        beerGardenCls += this.state.active ? ' active' :'';

        var detailedLink = 'detail.html?garden=' + this.props.id;
        var status = 'col-1-2 status align-left ' + this.props.status;
        var rating = 'col-1-2 rating align-right rating-' + this.props.rating;

        return (
            <li className={beerGardenCls} onClick={this.handleClick}>
                <p className="grid">
                    <span className="data">
                        <span className="col-9-12 title align-left">{this.props.title}</span>
                        <span className="col-3-12 distance align-right">{this.props.distance} km</span>
                    </span>
                    <i className="more fa fa-chevron-right"></i>
                </p>
            </li>
        );
    }
});

/* Component LoadingOverlay */
var LoadingOverlay = React.createClass({
    render: function () {
        return (
            <div className="cmp-loading-overlay overlay">
                <span>
                    <i className="fa fa-refresh active"></i>
                    <span>Daten werden geladen...</span>
                </span>
            </div>
        );
    }
});

/* Component TabNavigation */
var TabNavigation = React.createClass({
    render: function () {
        return (
            <footer>
                <ul className="cmp-tab-navigation tab-navigation">
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
});

ReactDOM.render(
    <Search />,
    document.getElementById('app')
);