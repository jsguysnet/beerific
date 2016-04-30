var Beerific = {
    getData: function (callback) {
        var xmlHttp = null;
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Fehlerbehandlung, wenn die Schnittstelle vom Browser nicht unterstützt wird.
        }
        if (xmlHttp) {
            xmlHttp.open('GET', 'data/beer.json', true);
            xmlHttp.onreadystatechange = function () {
                if (4 === xmlHttp.readyState) {
                    var json = JSON.parse(xmlHttp.responseText);
                    callback(json);
                }
            };
            xmlHttp.send(null);
        }
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
    },
    
    createList: function (data, list) {
        var self = this;

        data.forEach(function (item) {
            var elem = self.createListItem(item);
            list.appendChild(elem);
            elem.addEventListener('click', function (event) {
                var listElements = document.getElementsByClassName('list-item');

                for (var i = 0; i < listElements.length; i++) {
                    listElements[i].setAttribute('class', listElements[i].getAttribute('class').replace(/\s*active/, ''));
                }

                var elem = 'LI' === event.target.nodeName ? event.target : event.target.parentNode;
                elem = 'LI' === elem.nodeName ? elem : elem.parentNode;
                elem.setAttribute('class', elem.getAttribute('class') + ' active');
            });
        });

        var elements = document.getElementsByClassName('list-item');
    },

    createListItem: function (item) {
        var li = document.createElement('li');
        var status = document.createElement('span');

        var ratings = document.createElement('span');
        var likes = document.createElement('span');
        var unlikes = document.createElement('span');
        var additionalData = this.getTeaserData(item);

        li.setAttribute('class', 'list-item ' + item.status);
        status.setAttribute('class', 'status');
        ratings.setAttribute('class', 'ratings');
        additionalData.setAttribute('class', 'teaser')

        likes.setAttribute('class', 'fa fa-thumbs-up');
        likes.innerHTML = item.rating.like || '';

        unlikes.setAttribute('class', 'fa fa-thumbs-down');
        unlikes.innerHTML = item.rating.unlike || '';

        li.innerHTML = item.title;

        ratings.appendChild(likes);
        ratings.appendChild(unlikes);

        li.appendChild(status);
        li.appendChild(ratings);

        li.appendChild(additionalData);

        return li;
    },

    getTeaserData(item) {
        var teaserData = document.createElement('div');
        teaserData.setAttribute('class', 'teaser');

        var image = document.createElement('img');

        if (item.images) {
            image.src = item.images[0].src;
            teaserData.appendChild(image);
        }

        var detailed = document.createElement('p');
        detailed.innerHTML = item.teaser;

        var beerType = document.createElement('p');
        beerType.innerHTML = '<strong>Biersorte:</strong> ' + 'Biermarke';
        var price = document.createElement('p');
        price.innerHTML = '<strong>Maßpreis:</strong> ' + 'Maßpreis';

        teaserData.appendChild(detailed);
        teaserData.appendChild(beerType);
        teaserData.appendChild(price);

        return teaserData;
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
