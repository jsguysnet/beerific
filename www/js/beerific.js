var Beerific = {
    BASE_URL: 'http://api.beerific.jsguys.net',
	//BASE_URL: 'http://localhost:1812',

    _data: null,

    getData: function (filter, refresh, callback) {
        var self = this;

        refresh = !!refresh;
        if (refresh) {
            self._data = null;
        }

        callback = callback || function (data) { self._data = data; };

        if (self._data && !refresh) {
            callback(self._data);
            return;
        }

        if (null === self._data) {
            $('.cmp-loading-overlay').show();
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    self._getBeergardenList(position, filter, callback);
                },
                function (error) {
                    alert('Der Standort konnte nicht ermittelt werden.');
                    self._getBeergardenList(null, null, callback);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000
                }
            );
        }
    },

    _getBeergardenList: function (position, filter, callback) {
        var self = this;
        var url = self.BASE_URL + '/latest/beergarden/search.service';
		
		position = position || { latitude: 48.090180, longitude: 11.497929 };
		
		var lat = position.coords ? position.coords.latitude : position.latitude;
        var lng = position.coords ? position.coords.longitude : position.longitude;
		
		var postData = {
			latitude: lat,
			longitude: lng,
			username: 'jsguys',
			password: 'jsguys'
		};

		if (filter) {
			postData.filter = filter;
		}
		
		$.ajax(url, {
			method: 'post',
			data: postData,
			success: function (data) {
				if (data.success) {
					self._data = data.data;
                    callback(data.data);
				}
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
            url: this.BASE_URL + '/' + url,
            method: 'GET',
            success: success
        });
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

$(window).load(function () {
    Beerific.getData();
});
