'use strict';

System.register(['app/plugins/sdk', '../lib/leaflet', 'lodash', 'moment', '../css/leaflet.css!'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, L, _, moment, _createClass, tileServers, PhasorMapCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
        }, function (_libLeaflet) {
            L = _libLeaflet;
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_moment) {
            moment = _moment.default;
        }, function (_cssLeafletCss) {}],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            tileServers = {
                'Mapnik': { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'Black and White': { url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', options: { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'DE': { url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', options: { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'France': { url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', options: { maxZoom: 20, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'HOT': { url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'OpenTopoMap': { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', options: { maxZoom: 17, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
                'Grayscale': { url: 'https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', options: { maxZoom: 19, attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' } },
                'Positron': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd' } },
                'DarkMatter': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd' } }

            };

            _export('PhasorMapCtrl', PhasorMapCtrl = function (_MetricsPanelCtrl) {
                _inherits(PhasorMapCtrl, _MetricsPanelCtrl);

                // #region Constructor
                function PhasorMapCtrl($scope, $injector, $rootScope) {
                    _classCallCheck(this, PhasorMapCtrl);

                    var _this = _possibleConstructorReturn(this, (PhasorMapCtrl.__proto__ || Object.getPrototypeOf(PhasorMapCtrl)).call(this, $scope, $injector));

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    _this.events.on('panel-initialized', _this.onPanelInitialized.bind(_this));
                    _this.events.on('data-received', _this.onDataRecieved.bind(_this));
                    //this.events.on('data-snapshot-load', console.log('data-snapshot-load'));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('refresh', _this.onRefresh.bind(_this));

                    // Variables for options
                    _this.panel.mapBackgrounds = Object.keys(tileServers);
                    _this.panel.mapBackground = _this.panel.mapBackground != undefined ? _this.panel.mapBackground : _this.panel.mapBackgrounds[0];
                    _this.panel.maxZoom = tileServers[_this.panel.mapBackground].options.maxZoom;
                    _this.panel.minZoom = tileServers[_this.panel.mapBackground].options.minZoom != undefined ? tileServers[_this.panel.mapBackground].options.minZoom : 2;
                    _this.panel.zoomLevel = _this.panel.zoomLevel != undefined ? _this.panel.zoomLevel : tileServers[_this.panel.mapBackground].options.maxZoom;
                    _this.panel.lockMap = _this.panel.lockMap != undefined ? _this.panel.lockMap : 'No';
                    _this.panel.maxLongitude = _this.panel.maxLongitude != undefined ? _this.panel.maxLongitude : -125;
                    _this.panel.maxLatitude = _this.panel.maxLatitude != undefined ? _this.panel.maxLatitude : 24;
                    _this.panel.minLatitude = _this.panel.minLatitude != undefined ? _this.panel.minLatitude : 50;
                    _this.panel.minLongitude = _this.panel.minLongitude != undefined ? _this.panel.minLongitude : -66;
                    _this.panel.circleRadius = _this.panel.circleRadius != undefined ? _this.panel.circleRadius : 50;
                    _this.panel.useReferenceValue = _this.panel.useReferenceValue != undefined ? _this.panel.useReferenceValue : false;
                    _this.panel.referencePointTag = _this.panel.referencePointTag != undefined ? _this.panel.referencePointTag : '';
                    _this.panel.useAngleMean = _this.panel.useAngleMean != undefined ? _this.panel.useAngleMean : false;
                    _this.panel.angleMeanTimeWindow = _this.panel.angleMeanTimeWindow != undefined ? _this.panel.angleMeanTimeWindow : '5';

                    // Scope Variables
                    _this.$scope.tileLayer = null;
                    _this.$scope.mapContainer = null;
                    _this.$scope.metaData = null;
                    _this.$scope.magTags = [];
                    _this.$scope.angleTags = [];
                    _this.$scope.powerTags = [];
                    _this.$scope.phasorPairs = {};
                    _this.$scope.circleMarkers = [];
                    return _this;
                }
                // #endregion

                // #region Events from Graphana Handlers


                _createClass(PhasorMapCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/editor.html', 2);
                        this.addEditorTab('Circles', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/circle_options.html', 3);
                        //console.log('init-edit-mode');
                    }
                }, {
                    key: 'onPanelTeardown',
                    value: function onPanelTeardown() {
                        this.map.off('zoomend');
                        this.map.off('moveend');
                        //console.log('panel-teardown');
                    }
                }, {
                    key: 'onPanelInitialized',
                    value: function onPanelInitialized() {
                        //console.log('panel-initialized');
                    }
                }, {
                    key: 'onRefresh',
                    value: function onRefresh() {
                        var ctrl = this;

                        if (ctrl.height > ctrl.row.height) ctrl.render();

                        //console.log('refresh');
                    }
                }, {
                    key: 'onResize',
                    value: function onResize() {
                        var ctrl = this;
                        console.log('refresh');
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {
                        //console.log('render');
                    }
                }, {
                    key: 'onDataRecieved',
                    value: function onDataRecieved(data) {
                        var ctrl = this;

                        ctrl.createMap();

                        if (ctrl.$scope.metaData == null || ctrl.editMode) {
                            ctrl.getMetadata(data);
                        } else {
                            ctrl.updateData(data);
                        }
                        //console.log('data-recieved');
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(msg) {
                        console.log('data-error');
                    }
                }, {
                    key: 'createMap',
                    value: function createMap() {
                        var ctrl = this;

                        if (ctrl.$scope.mapContainer == null) {

                            var mapOptions = {
                                zoomControl: false,
                                attributionControl: false,
                                boxZoom: false,
                                doubleClickZoom: false,
                                dragging: ctrl.panel.lockMap == 'No',
                                zoomDelta: ctrl.panel.lockMap == 'No' ? 1 : 0,
                                minZoom: ctrl.panel.lockMap == 'No' ? ctrl.panel.minZoom : ctrl.panel.zoomLevel,
                                maxZoom: ctrl.panel.lockMap == 'No' ? ctrl.panel.maxZoom : ctrl.panel.zoomLevel
                            };

                            ctrl.$scope.mapContainer = L.map('mapid_' + ctrl.panel.id, mapOptions);
                            ctrl.$scope.tileLayer = L.tileLayer(tileServers[ctrl.panel.mapBackground].url, tileServers[ctrl.panel.mapBackground].options);
                            ctrl.$scope.tileLayer.addTo(ctrl.$scope.mapContainer);
                            ctrl.updateMapView();
                            ctrl.$scope.mapContainer.off('zoomend');
                            ctrl.$scope.mapContainer.on('zoomend', function (event) {
                                ctrl.panel.zoomLevel = ctrl.$scope.mapContainer.getZoom();

                                var bounds = ctrl.$scope.mapContainer.getBounds();
                                ctrl.panel.maxLongitude = bounds._southWest.lng;
                                ctrl.panel.maxLatitude = bounds._northEast.lat;
                                ctrl.panel.minLatitude = bounds._southWest.lat;
                                ctrl.panel.minLongitude = bounds._northEast.lng;

                                ctrl.refresh();
                            });
                            ctrl.$scope.mapContainer.off('moveend');
                            ctrl.$scope.mapContainer.on('moveend', function (event) {
                                ctrl.panel.zoomLevel = ctrl.$scope.mapContainer.getZoom();

                                var bounds = ctrl.$scope.mapContainer.getBounds();
                                ctrl.panel.maxLongitude = bounds._southWest.lng;
                                ctrl.panel.maxLatitude = bounds._northEast.lat;
                                ctrl.panel.minLatitude = bounds._southWest.lat;
                                ctrl.panel.minLongitude = bounds._northEast.lng;

                                ctrl.refresh();
                            });
                        }
                    }
                }, {
                    key: 'plotMetaData',
                    value: function plotMetaData() {
                        var ctrl = this;

                        _.each(ctrl.$scope.circleMarkers, function (element, index, list) {
                            element.remove();
                        });

                        _.each(ctrl.$scope.phasorPairs, function (element, index, list) {
                            var r = parseInt(ctrl.panel.circleRadius.toString()) * 1.2;
                            var divIcon = L.divIcon({
                                html: '<canvas width="' + 2 * r + '" height="' + 2 * r + '" style="position:relative; top:-' + (r - 5) + 'px;left:-' + (r - 5) + 'px"></canvas>',
                                iconSize: [12, 12]
                            });
                            var circle = L.marker([element.Latitude, element.Longitude], { icon: divIcon });
                            ctrl.$scope.circleMarkers.push(circle);
                            circle.addTo(ctrl.$scope.mapContainer);
                            ctrl.$scope.phasorPairs[index].divIcon = circle._icon;
                            ctrl.updatePhasorChart(index);
                        });
                    }
                }, {
                    key: 'updatePhasorChart',
                    value: function updatePhasorChart(phasorId) {
                        var ctrl = this;

                        var phasor = ctrl.$scope.phasorPairs[phasorId];

                        var canvas = $(phasor.divIcon).children();
                        var context = canvas[0].getContext("2d");
                        context.clearRect(0, 0, canvas.width, canvas.height);

                        var center = { x: canvas.width() / 2, y: canvas.height() / 2 };
                        var chartRadius = ctrl.panel.circleRadius;

                        function drawBackground() {
                            context.strokeStyle = "#000000";
                            context.beginPath();
                            context.arc(center.x, center.y, chartRadius, 0, 2 * Math.PI);
                            context.stroke();
                            context.fillStyle = "#FFFFFF";
                            context.fill();
                        }

                        function drawGrid() {
                            context.lineWidth = 1;
                            context.strokeStyle = "#DDD";
                            for (var i = 0; i < 18; i++) {
                                drawVector(chartRadius, i * Math.PI / 9);
                            }for (var i = 1; i < 8; i++) {
                                drawCircle(1 * chartRadius * i / 8);
                            }
                        }

                        function drawPhasors() {
                            var vMax = 0;
                            var iMax = 0;

                            context.lineWidth = 3;

                            $.each(phasorData, function (key, series) {
                                if (series == undefined) return;

                                if (series.color == undefined) return;

                                $.each(series.data, function (_, dataPoint) {
                                    series.vector = dataPoint;

                                    if (dataPoint[0] >= xaxisHover) return false;
                                });

                                if (key < 3 && series.vector[1] > vMax) vMax = series.vector[1];
                                if (key >= 3 && series.vector[1] > iMax) iMax = series.vector[1];
                            });

                            $.each(phasorData, function (key, series) {
                                var scale;

                                if (series == undefined) return;

                                if (series.vector == undefined) return;

                                if (key < 3) {
                                    scale = 0.9 * chartRadius / vMax;
                                } else {
                                    scale = 0.9 * chartRadius / iMax;
                                    context.setLineDash([10, 5]);
                                }

                                context.strokeStyle = series.color;
                                drawVector(series.vector[1] * scale, series.vector[2]);
                                context.setLineDash([]);
                            });
                        }

                        function drawVector(r, t) {
                            var x = r * Math.cos(t);
                            var y = r * Math.sin(t);

                            context.beginPath();
                            context.moveTo(center.x, center.y);
                            context.lineTo(center.x + x, center.y - y);
                            context.stroke();
                        }

                        function drawCircle(r) {
                            context.beginPath();
                            context.arc(center.x, center.y, r, 0, 2 * Math.PI);
                            context.stroke();
                        }

                        function drawAngleArrow(angle) {

                            angle = angle - 90;
                            var radians = angle * (Math.PI / 180);

                            var headlen = 5; // length of head in pixels
                            var x = chartRadius * Math.cos(radians) + center.x;
                            var y = chartRadius * Math.sin(radians) + center.y;

                            context.strokeStyle = "#000000";
                            context.beginPath();
                            context.moveTo(center.x, center.y);
                            context.lineTo(x, y);
                            context.lineTo(x - headlen * Math.cos(radians - Math.PI / 6), y - headlen * Math.sin(radians - Math.PI / 6));
                            context.moveTo(x, y);
                            context.lineTo(x - headlen * Math.cos(radians + Math.PI / 6), y - headlen * Math.sin(radians + Math.PI / 6));
                            context.stroke();
                        }

                        function drawMagCircle(magnitude) {
                            context.strokeStyle = "#FFFF00";
                            context.beginPath();
                            context.arc(center.x, center.y, chartRadius * (magnitude / 2000), 0, 2 * Math.PI);
                            context.stroke();
                            context.fillStyle = "#FFFF00";
                            context.fill();
                        }

                        function drawAverageLine(angle) {
                            angle = angle - 90;
                            var radians = angle * (Math.PI / 180);

                            var x = chartRadius * Math.cos(radians) + center.x;
                            var y = chartRadius * Math.sin(radians) + center.y;

                            context.strokeStyle = "#FF0000";
                            context.beginPath();
                            context.moveTo(center.x, center.y);
                            context.lineTo(x, y);
                            context.stroke();
                        }

                        drawBackground();
                        drawGrid();
                        drawMagCircle(phasor.MagnitudeValue);

                        drawAngleArrow(phasor.AngleValue);
                        if (phasor.angleMean) drawAverageLine(phasor.angleMean);
                    }
                }, {
                    key: 'getMetadata',
                    value: function getMetadata(data) {
                        var ctrl = this;
                        if (ctrl.datasource.getMetaData == undefined) return;
                        ctrl.$scope.phasorPairs = {};
                        $('canvas').remove();
                        ctrl.datasource.getMetaData(data.map(function (x) {
                            return "'" + x.pointtag + "'";
                        }).join(',')).then(function (d) {
                            if (d.data == "") return;
                            ctrl.$scope.metaData = JSON.parse(d.data);
                            _.each(ctrl.$scope.metaData, function (element, index, list) {
                                if (element.PhasorID == null) return;

                                if (!ctrl.$scope.phasorPairs.hasOwnProperty(element.PhasorID)) ctrl.$scope.phasorPairs[element.PhasorID] = {};

                                ctrl.$scope.phasorPairs[element.PhasorID].PhasorType = element.PhasorType;
                                ctrl.$scope.phasorPairs[element.PhasorID].Latitude = element.Latitude;
                                ctrl.$scope.phasorPairs[element.PhasorID].Longitude = element.Longitude;

                                if (element.SignalType.indexOf('PHM') >= 0) {
                                    ctrl.$scope.phasorPairs[element.PhasorID].MagnitudeTag = element.PointTag;
                                    ctrl.$scope.phasorPairs[element.PhasorID].MagnitudeValue = 0;
                                } else if (element.SignalType.indexOf('PHA') >= 0) {
                                    ctrl.$scope.phasorPairs[element.PhasorID].AngleTag = element.PointTag;
                                    ctrl.$scope.phasorPairs[element.PhasorID].AngleValue = 0;
                                }
                            });

                            ctrl.plotMetaData();

                            ctrl.updateData(data);
                        });
                    }
                }, {
                    key: 'updateData',
                    value: function updateData(data) {
                        var ctrl = this;
                        var refpoints = null;

                        var refAngle = 0;
                        if (ctrl.panel.useReferenceValue) {
                            var tag = _.find(data, function (o) {
                                return o.pointtag == ctrl.panel.referencePointTag.AngleTag;
                            });
                            refAngle = tag.datapoints[tag.datapoints.length - 1][0];

                            if (ctrl.panel.useAngleMean) {
                                var timeWindow = ctrl.panel.angleMeanTimeWindow * 60 * 1000;
                                var lastTime = tag.datapoints[tag.datapoints.length - 1][1];
                                var firstTime = lastTime - timeWindow;

                                refpoints = _.filter(tag.datapoints, function (v) {
                                    return v[1] > firstTime;
                                });
                            }
                        }

                        _.each(data, function (element, index, list) {
                            var phasorId = _.find(ctrl.$scope.metaData, function (o) {
                                return element.pointtag == o.PointTag;
                            }).PhasorID;

                            if (element.pointtag == ctrl.$scope.phasorPairs[phasorId].MagnitudeTag && element.datapoints.length > 0) {
                                ctrl.$scope.phasorPairs[phasorId].MagnitudeValue = element.datapoints[element.datapoints.length - 1][0];
                            } else if (element.pointtag == ctrl.$scope.phasorPairs[phasorId].AngleTag && element.datapoints.length > 0) {
                                ctrl.$scope.phasorPairs[phasorId].AngleValue = element.datapoints[element.datapoints.length - 1][0] - refAngle;

                                if (ctrl.panel.useAngleMean) {
                                    var timeWindow = ctrl.panel.angleMeanTimeWindow * 60 * 1000;
                                    var i = element.datapoints.length - 1;
                                    var lastTime = element.datapoints[i][1];
                                    var firstTime = lastTime - timeWindow;

                                    var anglepoints = _.filter(element.datapoints, function (v) {
                                        return v[1] > firstTime;
                                    });

                                    _.each(anglepoints, function (e, j, l) {
                                        if (ctrl.panel.useReferenceValue && e[1] == refpoints[j][1]) e = e - refpoints[i][1];
                                    });

                                    ctrl.$scope.phasorPairs[phasorId].angleMean = _.mean(_.map(anglepoints, function (o) {
                                        return o[0];
                                    }));
                                } else ctrl.$scope.phasorPairs[phasorId].angleMean = null;
                            }

                            ctrl.updatePhasorChart(phasorId);
                        });
                    }
                }, {
                    key: 'changeMapBackground',
                    value: function changeMapBackground() {
                        var ctrl = this;

                        ctrl.$scope.tileLayer.remove();
                        ctrl.$scope.tileLayer = L.tileLayer(tileServers[this.panel.mapBackground].url, tileServers[this.panel.mapBackground].options);
                        ctrl.$scope.tileLayer.addTo(this.$scope.mapContainer);
                    }
                }, {
                    key: 'updateZoom',
                    value: function updateZoom() {
                        var ctrl = this;

                        ctrl.$scope.mapContainer.options.minZoom = ctrl.panel.lockMap == 'No' ? ctrl.panel.minZoom : ctrl.panel.zoomLevel;
                        ctrl.$scope.mapContainer.options.maxZoom = ctrl.panel.lockMap == 'No' ? ctrl.panel.maxZoom : ctrl.panel.zoomLevel;

                        ctrl.$scope.mapContainer.setZoom(ctrl.panel.zoomLevel);
                    }
                }, {
                    key: 'updateMapView',
                    value: function updateMapView() {
                        var ctrl = this;

                        ctrl.$scope.mapContainer.fitBounds([[ctrl.panel.maxLatitude, ctrl.panel.maxLongitude], [ctrl.panel.minLatitude, ctrl.panel.minLongitude]]);
                    }
                }, {
                    key: 'lockMap',
                    value: function lockMap() {
                        var ctrl = this;

                        ctrl.$scope.mapContainer.remove();
                        ctrl.$scope.mapContainer = null;
                        ctrl.createMap();
                        ctrl.plotMetaData();
                    }
                }, {
                    key: 'boundToMarkers',
                    value: function boundToMarkers() {
                        var ctrl = this;

                        var markerGroup = new L.featureGroup(ctrl.$scope.circleMarkers);
                        if (markerGroup.getBounds().isValid()) ctrl.$scope.mapContainer.fitBounds(markerGroup.getBounds());

                        var bounds = ctrl.$scope.mapContainer.getBounds();
                        ctrl.panel.maxLongitude = bounds._southWest.lng;
                        ctrl.panel.maxLatitude = bounds._northEast.lat;
                        ctrl.panel.minLatitude = bounds._southWest.lat;
                        ctrl.panel.minLongitude = bounds._northEast.lng;
                    }
                }, {
                    key: 'getRange',
                    value: function getRange(min, max, step) {
                        step = step || 1;
                        var input = [];
                        for (var i = min; i <= max; i += step) {
                            input.push(i);
                        }
                        return input;
                    }
                }]);

                return PhasorMapCtrl;
            }(MetricsPanelCtrl));

            _export('PhasorMapCtrl', PhasorMapCtrl);

            PhasorMapCtrl.templateUrl = 'partials/module.html';
        }
    };
});
//# sourceMappingURL=phasorMap_ctrl.js.map
