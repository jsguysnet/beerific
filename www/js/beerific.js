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
        var additionalData = document.createElement('div');

        li.setAttribute('class', 'list-item ' + item.status);
        status.setAttribute('class', 'status');
        ratings.setAttribute('class', 'ratings');

        likes.setAttribute('class', 'fa fa-thumbs-up');
        likes.innerHTML = item.rating.like || '';

        unlikes.setAttribute('class', 'fa fa-thumbs-down');
        unlikes.innerHTML = item.rating.unlike || '';


        li.innerHTML = item.title;

        ratings.appendChild(likes);
        ratings.appendChild(unlikes)

        li.appendChild(status);
        li.appendChild(ratings);

        li.appendChild(additionalData);

        return li;
    }
};

window.onload = function () {
    var self = this;

    Beerific.getData(function (data) {
        if (data.success) {
            var beertastic = document.getElementById('beertastic');
            Beerific.createList(data.content, beertastic);
        }
        else {
            alert('Fehler beim Laden der Daten, du gehst heute nüchtern nach Hause!')
        }
    });
};