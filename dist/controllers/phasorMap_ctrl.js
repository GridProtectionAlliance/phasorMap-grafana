'use strict';

System.register(['app/plugins/sdk', 'lodash', 'moment', '../css/leaflet.css!', './../js/constants'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, moment, TileServers, _createClass, PhasorMapCtrl;

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
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_moment) {
            moment = _moment.default;
        }, function (_cssLeafletCss) {}, function (_jsConstants) {
            TileServers = _jsConstants.TileServers;
        }],
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
                    _this.panel.mapBackgrounds = Object.keys(TileServers);
                    _this.panel.mapBackground = _this.panel.mapBackground != undefined ? _this.panel.mapBackground : _this.panel.mapBackgrounds[0];
                    _this.panel.maxZoom = TileServers[_this.panel.mapBackground].options.maxZoom;
                    _this.panel.minZoom = TileServers[_this.panel.mapBackground].options.minZoom != undefined ? TileServers[_this.panel.mapBackground].options.minZoom : 2;
                    _this.panel.zoomLevel = _this.panel.zoomLevel != undefined ? _this.panel.zoomLevel : TileServers[_this.panel.mapBackground].options.maxZoom;
                    _this.panel.lockMap = _this.panel.lockMap != undefined ? _this.panel.lockMap : 'No';
                    _this.panel.maxLongitude = _this.panel.maxLongitude != undefined ? _this.panel.maxLongitude : -125;
                    _this.panel.maxLatitude = _this.panel.maxLatitude != undefined ? _this.panel.maxLatitude : 24;
                    _this.panel.minLatitude = _this.panel.minLatitude != undefined ? _this.panel.minLatitude : 50;
                    _this.panel.minLongitude = _this.panel.minLongitude != undefined ? _this.panel.minLongitude : -66;
                    _this.panel.circleRadius = _this.panel.circleRadius != undefined ? _this.panel.circleRadius : 50;
                    _this.panel.angleMarkerWidth = _this.panel.angleMarkerWidth != undefined ? _this.panel.angleMarkerWidth : 5;
                    _this.panel.minAngleMarkerWidth = _this.panel.minAngleMarkerWidth != undefined ? _this.panel.minAngleMarkerWidth : 1;
                    _this.panel.maxAngleMarkerWidth = _this.panel.maxAngleMarkerWidth != undefined ? _this.panel.maxAngleMarkerWidth : 1;
                    _this.panel.showMinAngle = _this.panel.showMinAngle != undefined ? _this.panel.showMinAngle : true;
                    _this.panel.showMaxAngle = _this.panel.showMaxAngle != undefined ? _this.panel.showMaxAngle : true;

                    _this.panel.useReferenceValue = _this.panel.useReferenceValue != undefined ? _this.panel.useReferenceValue : false;
                    _this.panel.referencePointTag = _this.panel.referencePointTag != undefined ? _this.panel.referencePointTag : '';
                    _this.panel.useAngleMean = _this.panel.useAngleMean != undefined ? _this.panel.useAngleMean : false;
                    _this.panel.angleMeanTimeWindow = _this.panel.angleMeanTimeWindow != undefined ? _this.panel.angleMeanTimeWindow : '5';
                    _this.panel.showLegend = _this.panel.showLegend != undefined ? _this.panel.showLegend : false;

                    // Scope Variables
                    _this.$scope.tileLayer = null;
                    _this.$scope.mapContainer = null;
                    _this.$scope.circleMarkers = [];
                    _this.$scope.data = [];
                    return _this;
                }
                // #endregion

                // #region Events from Graphana Handlers


                _createClass(PhasorMapCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/editor.html', 2);
                        //console.log('init-edit-mode');
                    }
                }, {
                    key: 'onPanelTeardown',
                    value: function onPanelTeardown() {
                        if (this.map) {
                            this.map.off('zoomend');
                            this.map.off('moveend');
                        }
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

                        ctrl.$scope.data = data;

                        ctrl.createMap();

                        ctrl.plotPhasorData(data);
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
                            ctrl.$scope.tileLayer = L.tileLayer(TileServers[ctrl.panel.mapBackground].url, TileServers[ctrl.panel.mapBackground].options);
                            ctrl.$scope.tileLayer.addTo(ctrl.$scope.mapContainer);
                            ctrl.updateMapView();

                            // setup map listeners
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
                    key: 'updatePhasorChart',
                    value: function updatePhasorChart(div, data) {
                        var ctrl = this;

                        var canvas = $(div).children();
                        var context = canvas[0].getContext("2d");
                        context.clearRect(0, 0, canvas.width, canvas.height);

                        var center = { x: canvas.width() / 2, y: canvas.height() / 2 };
                        var chartRadius = ctrl.panel.circleRadius;

                        function drawBackground() {
                            context.lineWidth = 1;
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

                            context.lineWidth = 1;

                            context.beginPath();
                            context.moveTo(center.x, center.y);
                            context.lineTo(center.x + x, center.y - y);
                            context.stroke();
                        }

                        function drawCircle(r) {
                            context.lineWidth = 1;

                            context.beginPath();
                            context.arc(center.x, center.y, r, 0, 2 * Math.PI);
                            context.stroke();
                        }

                        function drawAngleArrow(angle) {

                            angle = angle - 90;
                            var radians = angle * (Math.PI / 180);

                            var headlen = 10; // length of head in pixels
                            var x = chartRadius * Math.cos(radians) + center.x;
                            var y = chartRadius * Math.sin(radians) + center.y;

                            context.lineWidth = 5;
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
                            context.lineWidth = 1;

                            context.strokeStyle = "#FFFF00";
                            context.beginPath();
                            context.arc(center.x, center.y, chartRadius * (magnitude / 2), 0, 2 * Math.PI);
                            context.stroke();
                            context.fillStyle = "#FFFF00";
                            context.fill();
                        }

                        function drawLine(angle, color, width) {
                            context.lineWidth = width;

                            angle = angle - 90;
                            var radians = angle * (Math.PI / 180);

                            var x = chartRadius * Math.cos(radians) + center.x;
                            var y = chartRadius * Math.sin(radians) + center.y;

                            context.strokeStyle = color;
                            context.beginPath();
                            context.moveTo(center.x, center.y);
                            context.lineTo(x, y);
                            context.stroke();
                        }

                        drawBackground();
                        drawGrid();
                        drawMagCircle(data.magvalue);

                        if (ctrl.panel.showMinAngle) drawLine(data.minanglevalue, "#FF0000", ctrl.panel.minAngleMarkerWidth);
                        if (ctrl.panel.showMaxAngle) drawLine(data.maxanglevalue, "#FF0000", ctrl.panel.maxAngleMarkerWidth);
                        drawLine(data.anglevalue, "#000000", ctrl.panel.angleMarkerWidth);

                        //if (phasor.angleMean)
                        //    drawAverageLine(phasor.angleMean);
                    }
                }, {
                    key: 'plotPhasorData',
                    value: function plotPhasorData(data) {
                        var ctrl = this;

                        _.each(ctrl.$scope.circleMarkers, function (element, index, list) {
                            element.remove();
                        });

                        ctrl.$scope.circleMarkers = [];

                        _.each(data, function (element, index, list) {
                            var r = parseInt(ctrl.panel.circleRadius.toString()) * 1.2;
                            var divIcon = L.divIcon({
                                html: '<canvas width="' + 2 * r + '" height="' + 2 * r + '" style="position:relative; top:-' + (r - 5) + 'px;left:-' + (r - 5) + 'px"></canvas>',
                                iconSize: [12, 12]
                            });
                            var circle = L.marker([element.latitude, element.longitude], { icon: divIcon }).on('click', function (event) {
                                var popup = window.open("http://localhost:3000/dashboard/db/templatephasor?var-Angle=" + encodeURIComponent(element.anglepointtag) + "&var-Magnitude=" + encodeURIComponent(element.magpointtag) + "&from=" + ctrl.dashboard.time.from + "&to=" + ctrl.dashboard.time.to + (ctrl.dashboard.refresh ? "&refresh=" + ctrl.dashboard.refresh : ""), "_blank");
                            });
                            ctrl.$scope.circleMarkers.push(circle);
                            circle.addTo(ctrl.$scope.mapContainer);
                            ctrl.updatePhasorChart(circle._icon, element);

                            if (element.tolongitude != "" && element.tolatitude != "") {
                                var line;
                                if (element.powervalue >= 0) line = L.polyline([[element.latitude, element.longitude], [element.tolatitude, element.tolongitude]], { color: 'red' }).on('click', function (event) {
                                    var popup = window.open("http://localhost:3000/dashboard/db/templating?var-AngleA=" + encodeURIComponent(element.anglepointtag) + "&var-AngleB=" + encodeURIComponent(element.toanglepointtag) + "&var-LineMW=" + encodeURIComponent(element.powerpointtag) + "&from=" + ctrl.dashboard.time.from + "&to=" + ctrl.dashboard.time.to + (ctrl.dashboard.refresh ? "&refresh=" + ctrl.dashboard.refresh : ""), "_blank");
                                });else line = L.polyline([[element.tolatitude, element.tolongitude], [element.latitude, element.longitude]], { color: 'red' }).on('click', function (event) {
                                    var popup = window.open("http://localhost:3000/dashboard/db/templating?var-AngleA=" + encodeURIComponent(element.anglepointtag) + "&var-AngleB=" + encodeURIComponent(element.toanglepointtag) + "&var-LineMW=" + encodeURIComponent(element.powerpointtag) + "&from=" + ctrl.dashboard.time.from + "&to=" + ctrl.dashboard.time.to + (ctrl.dashboard.refresh ? "&refresh=" + ctrl.dashboard.refresh : ""), "_blank");
                                });

                                var decorator = L.polylineDecorator(line, {
                                    patterns: [{ offset: '60%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: 'red', fillOpacity: 1, weight: 0 } }) }]
                                });

                                ctrl.$scope.circleMarkers.push(line);
                                ctrl.$scope.circleMarkers.push(decorator);

                                line.addTo(ctrl.$scope.mapContainer);
                                decorator.addTo(ctrl.$scope.mapContainer);
                            }
                        });
                    }
                }, {
                    key: 'changeMapBackground',
                    value: function changeMapBackground() {
                        var ctrl = this;

                        ctrl.$scope.tileLayer.remove();
                        ctrl.$scope.tileLayer = L.tileLayer(TileServers[this.panel.mapBackground].url, TileServers[this.panel.mapBackground].options);
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
                }, {
                    key: 'fixAngle',
                    value: function fixAngle(angle) {
                        if (angle > -180 && angle <= 180) return angle;else if (angle <= -180) return 360 + angle;else if (angle > 180) return angle - 360;
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
