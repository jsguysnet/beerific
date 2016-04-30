var Beerific = {
    getData: function (callback) {
        var xmlHttp = null;
        try {
            xmlHttp = new XMLHttpRequest();
        } catch(e) {
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
                data.content.forEach(function (beer) {
                    var beerGarden = document.createElement('li');
                    beerGarden.innerHTML = beer.title;
                    beertastic.appendChild(beerGarden);
                });
            }
            else {
                alert('Fehler beim Laden der Daten, du gehst heute nüchtern nach Hause!')
            }
        })
    };
}
