'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var TileServers;
    return {
        setters: [],
        execute: function () {
            _export('TileServers', TileServers = {
                'Mapnik': {
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'Black and White': {
                    url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'DE': {
                    url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'France': {
                    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 20,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'HOT': {
                    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'OpenTopoMap': {
                    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 17,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;'
                    }
                },
                'Grayscale': {
                    url: 'https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}',
                    options: {
                        maxZoom: 19,
                        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }
                },
                'Positron': {
                    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd'
                    }
                },
                'DarkMatter': {
                    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
                    options: {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd'
                    }
                }
            });

            _export('TileServers', TileServers);
        }
    };
});
//# sourceMappingURL=constants.js.map
