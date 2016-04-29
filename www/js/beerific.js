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
    }
};

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