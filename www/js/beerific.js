var Beerific = {
    BASE_URL: 'http://api.beerific.jsguys.net/',
    
    EARTH_RADIUS: 6378.388,
    BASE_URL: 'http://api.beerific.jsguys.net/',

    getData: function (filter, callback) {
        var self = this;
        var url = 'http://api.beerific.jsguys.net';

        var lat = 48.090180;
        var lng = 11.497929;
        
        this._request('v_beergarden_list' , function (data) {
            if (data.success) {
                var beergarden = data.data;

                var items = data.data.map(function (item) {
                    item['distance'] = self._getDistance(lat, lng, item.latitude, item.longitude, 1);
                    return item;
                });
                
                callback(items);
            }
        });
    },
    
    getDataset: function (table, id, callback) {
        this._request(table + '/' + id, function (data) {
            if (data.success) {
                callback(data.data[0]);
            }
        })
    },
    
    _request: function (url, success) {
        $.ajax({
            url: this.BASE_URL + url,
            method: 'GET',
            success: success
        });
    },

    _getDistance: function (lat1, lng1, lat2, lng2, accuracy) {
        var self = this;

        var latProd = Math.sin(lat1) * Math.sin(lat2);
        var lngProd = Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        var acc = accuracy ? Math.pow(10, accuracy) : 10;

        distance = self.EARTH_RADIUS * Math.acos(latProd + lngProd) * (Math.PI / 180);
        return Math.round(distance * acc) / acc;
    },

    createDetails: function (beer) {
        document.getElementsByClassName('title')[0].innerHTML = beer.title;
        document.getElementsByClassName('description')[0].innerHTML = beer.description;
        var headline = document.getElementsByClassName('headline')[0];
        headline.style.backgroundImage = 'url(' + beer.images[0].src + ')';
        var food = document.getElementsByClassName('food')[0].getElementsByTagName('ul')[0];
        beer.menu.food.forEach(function (entry) {
            var li = document.createElement('li');
            li.innerHTML = entry.title + ' – ' + entry.price + '€';
            food.appendChild(li);
        });
    }
};

function beerDetails() {
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
                                Beerific.createDetails(beer);
                            }
                        });
                    }
                });
                
                return;
            }
        });
    }
}

function beerList() {
    window.onload = function () {
        Beerific.getData(function (data) {
            if (data.success) {
                var content = document.getElementById('content');

                var beertastic = document.getElementById('beertastic');
                Beerific.createList(data.content, beertastic);
            }
            else {
                alert('Fehler beim Laden der Daten, du gehst heute nüchtern nach Hause!')
            }
        })
    };
}
