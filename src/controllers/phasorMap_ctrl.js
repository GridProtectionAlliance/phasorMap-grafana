//******************************************************************************************************
//  phasorMap_ctrl.js - Gbtc
//
//  Copyright © 2017, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  10/23/2017 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

import { MetricsPanelCtrl } from 'app/plugins/sdk'
import * as L from '../lib/leaflet';
import _ from 'lodash';
import moment from 'moment';
import '../css/leaflet.css!';

// #region Constant Variables
const tileServers = {
    'Mapnik': { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'Black and White': { url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', options: { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'DE': { url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', options: { maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'France': { url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', options: { maxZoom: 20, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'HOT': { url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'OpenTopoMap': { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', options: { maxZoom: 17, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;' } },
    'Grayscale': { url: 'https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', options: { maxZoom: 19, attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' } },
    'Positron': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd' } },
    'DarkMatter': { url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', options: { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy;', subdomains: 'abcd' } },

};
// #endregion

export class PhasorMapCtrl extends MetricsPanelCtrl{
    // #region Constructor
    constructor($scope, $injector, $rootScope) {
        super($scope, $injector);

        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
        this.events.on('render', this.onRender.bind(this));
        this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
        this.events.on('data-received', this.onDataRecieved.bind(this));
        //this.events.on('data-snapshot-load', console.log('data-snapshot-load'));
        this.events.on('data-error', this.onDataError.bind(this));
        this.events.on('refresh', this.onRefresh.bind(this));
        
        // Variables for options
        this.panel.mapBackgrounds = Object.keys(tileServers);
        this.panel.mapBackground  = (this.panel.mapBackground != undefined ? this.panel.mapBackground : this.panel.mapBackgrounds[0]);
        this.panel.maxZoom        = tileServers[this.panel.mapBackground].options.maxZoom;
        this.panel.minZoom =        (tileServers[this.panel.mapBackground].options.minZoom != undefined ? tileServers[this.panel.mapBackground].options.minZoom : 2)
        this.panel.zoomLevel =      (this.panel.zoomLevel       != undefined ? this.panel.zoomLevel     : tileServers[this.panel.mapBackground].options.maxZoom);
        this.panel.lockMap =        (this.panel.lockMap         != undefined ? this.panel.lockMap       : 'No'  );
        this.panel.maxLongitude =   (this.panel.maxLongitude    != undefined ? this.panel.maxLongitude  : -125  );
        this.panel.maxLatitude =    (this.panel.maxLatitude     != undefined ? this.panel.maxLatitude   : 24    );
        this.panel.minLatitude =    (this.panel.minLatitude     != undefined ? this.panel.minLatitude   : 50    );
        this.panel.minLongitude =   (this.panel.minLongitude    != undefined ? this.panel.minLongitude  : -66   );
        this.panel.circleRadius =   (this.panel.circleRadius    != undefined ? this.panel.circleRadius  : 50    );  
        this.panel.useReferenceValue = (this.panel.useReferenceValue != undefined ? this.panel.useReferenceValue : false);
        this.panel.referencePointTag = (this.panel.referencePointTag != undefined ? this.panel.referencePointTag : '');  
        this.panel.useAngleMean = (this.panel.useAngleMean != undefined ? this.panel.useAngleMean : false);
        this.panel.angleMeanTimeWindow = (this.panel.angleMeanTimeWindow != undefined ? this.panel.angleMeanTimeWindow : '5');

        // Scope Variables
        this.$scope.tileLayer = null;
        this.$scope.mapContainer = null;
        this.$scope.metaData = null;
        this.$scope.magTags = [];
        this.$scope.angleTags = [];
        this.$scope.powerTags = [];
        this.$scope.phasorPairs = {};
        this.$scope.circleMarkers = [];
    }
    // #endregion

    // #region Events from Graphana Handlers
    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/editor.html', 2);
        this.addEditorTab('Circles', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/circle_options.html', 3);
        //console.log('init-edit-mode');
    }

    onPanelTeardown() {
        this.map.off('zoomend');
        this.map.off('moveend');
        //console.log('panel-teardown');
    }

    onPanelInitialized(){
        //console.log('panel-initialized');
    }

    onRefresh() {
        var ctrl = this;

        if (ctrl.height > ctrl.row.height) ctrl.render();

        //console.log('refresh');
    }

    onResize() {
        var ctrl = this;
        console.log('refresh');
    }

    onRender() {
        //console.log('render');
    }

    onDataRecieved(data) {
        var ctrl = this;

        ctrl.createMap()

        if (ctrl.$scope.metaData == null || ctrl.editMode) {
            ctrl.getMetadata(data);
        }
        else {
            ctrl.updateData(data);
        }
        //console.log('data-recieved');
    }

    onDataError(msg) {
        console.log('data-error');
    }
    // #endregion

    // #region Map and Marker Creation
    createMap() {
        var ctrl = this;

        if (ctrl.$scope.mapContainer == null) {

            var mapOptions = {
                zoomControl: false,
                attributionControl: false,
                boxZoom: false,
                doubleClickZoom: false,
                dragging: (ctrl.panel.lockMap == 'No'),
                zoomDelta: (ctrl.panel.lockMap == 'No'? 1: 0),
                minZoom: (ctrl.panel.lockMap == 'No' ? ctrl.panel.minZoom : ctrl.panel.zoomLevel),
                maxZoom: (ctrl.panel.lockMap == 'No' ? ctrl.panel.maxZoom : ctrl.panel.zoomLevel)
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

    plotMetaData() {
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

    updatePhasorChart(phasorId) {
        var ctrl = this;

        var phasor = ctrl.$scope.phasorPairs[phasorId];

        var canvas = $(phasor.divIcon).children();
        var context = canvas[0].getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        var center = { x: canvas.width() / 2, y: canvas.height() / 2 };
        var chartRadius = ctrl.panel.circleRadius;

        function drawBackground()
        {
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
            for (var i = 0; i < 18; i++)
                drawVector(chartRadius, i * Math.PI / 9);
            for (var i = 1; i < 8; i++)
                drawCircle(1 * chartRadius * i / 8);
        }

        function drawPhasors() {
            var vMax = 0;
            var iMax = 0;

            context.lineWidth = 3;

            $.each(phasorData, function (key, series) {
                if (series == undefined)
                    return;

                if (series.color == undefined)
                    return;

                $.each(series.data, function (_, dataPoint) {
                    series.vector = dataPoint;

                    if (dataPoint[0] >= xaxisHover)
                        return false;
                });

                if (key < 3 && series.vector[1] > vMax)
                    vMax = series.vector[1];
                if (key >= 3 && series.vector[1] > iMax)
                    iMax = series.vector[1];
            });

            $.each(phasorData, function (key, series) {
                var scale;

                if (series == undefined)
                    return;

                if (series.vector == undefined)
                    return;

                if (key < 3) {
                    scale = 0.9 * chartRadius / vMax;
                }
                else {
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

            var headlen = 5;   // length of head in pixels
            var x = chartRadius * Math.cos(radians) + center.x;
            var y = chartRadius * Math.sin(radians) + center.y;

            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(center.x, center.y);
            context.lineTo(x, y);
            context.lineTo(x - headlen * Math.cos(radians - Math.PI / 6), y - headlen * Math.sin(radians - Math.PI/6));
            context.moveTo(x, y);
            context.lineTo(x - headlen * Math.cos(radians + Math.PI / 6), y - headlen * Math.sin(radians + Math.PI / 6));
            context.stroke();
        }

        function drawMagCircle(magnitude) {
            context.strokeStyle = "#FFFF00";
            context.beginPath();
            context.arc(center.x, center.y, chartRadius*(magnitude/2000), 0, 2 * Math.PI);
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
        if (phasor.angleMean)
            drawAverageLine(phasor.angleMean);
    }

    // #endregion

    // #region Data
    getMetadata(data) {
        var ctrl = this;
        if (ctrl.datasource.getMetaData == undefined) return;
        ctrl.$scope.phasorPairs = {};
        $('canvas').remove();
        ctrl.datasource.getMetaData(data.map(x => { return "'" + x.pointtag + "'" }).join(',')).then(function (d) {
            if (d.data == "") return;
            ctrl.$scope.metaData = JSON.parse(d.data);
            _.each(ctrl.$scope.metaData, function (element, index, list) {
                if (element.PhasorID == null) return;

                if (!ctrl.$scope.phasorPairs.hasOwnProperty(element.PhasorID))
                    ctrl.$scope.phasorPairs[element.PhasorID] = {};

                ctrl.$scope.phasorPairs[element.PhasorID].PhasorType = element.PhasorType;
                ctrl.$scope.phasorPairs[element.PhasorID].Latitude = element.Latitude;
                ctrl.$scope.phasorPairs[element.PhasorID].Longitude = element.Longitude;


                if (element.SignalType.indexOf('PHM') >= 0) {
                    ctrl.$scope.phasorPairs[element.PhasorID].MagnitudeTag = element.PointTag;
                    ctrl.$scope.phasorPairs[element.PhasorID].MagnitudeValue = 0;
                }
                else if (element.SignalType.indexOf('PHA') >= 0) {
                    ctrl.$scope.phasorPairs[element.PhasorID].AngleTag = element.PointTag;
                    ctrl.$scope.phasorPairs[element.PhasorID].AngleValue = 0;
                }


            });

            ctrl.plotMetaData();

            ctrl.updateData(data);
        });

    }

    updateData(data) {
        var ctrl = this;
        var refpoints = null;

        var refAngle = 0;
        if (ctrl.panel.useReferenceValue) {
            var tag = _.find(data, function (o) { return o.pointtag == ctrl.panel.referencePointTag.AngleTag });
            refAngle = tag.datapoints[tag.datapoints.length - 1][0];

            if (ctrl.panel.useAngleMean) {
                var timeWindow = ctrl.panel.angleMeanTimeWindow * 60 * 1000;
                var lastTime = tag.datapoints[tag.datapoints.length-1][1];
                var firstTime = lastTime - timeWindow;

                refpoints = _.filter(tag.datapoints, function (v) { return v[1] > firstTime });
            }

        }

        


        _.each(data, function (element, index, list) {
            var phasorId = _.find(ctrl.$scope.metaData, function (o) {
                return element.pointtag == o.PointTag
            }).PhasorID;


            if (element.pointtag == ctrl.$scope.phasorPairs[phasorId].MagnitudeTag && element.datapoints.length > 0) {
                ctrl.$scope.phasorPairs[phasorId].MagnitudeValue = element.datapoints[element.datapoints.length - 1][0];
            }
            else if (element.pointtag == ctrl.$scope.phasorPairs[phasorId].AngleTag && element.datapoints.length > 0) {
                ctrl.$scope.phasorPairs[phasorId].AngleValue = element.datapoints[element.datapoints.length - 1][0] - refAngle;

                if (ctrl.panel.useAngleMean) {
                    var timeWindow = ctrl.panel.angleMeanTimeWindow * 60 * 1000;
                    var i = element.datapoints.length - 1;
                    var lastTime = element.datapoints[i][1];
                    var firstTime = lastTime - timeWindow;

                    var anglepoints = _.filter(element.datapoints, function (v) { return v[1] > firstTime });

                    _.each(anglepoints, function (e, j, l) {
                        if (ctrl.panel.useReferenceValue && e[1] == refpoints[j][1])
                            e = e - refpoints[i][1];
                    });

                    ctrl.$scope.phasorPairs[phasorId].angleMean = _.mean(_.map(anglepoints, function (o) { return o[0];}));
                }
                else
                    ctrl.$scope.phasorPairs[phasorId].angleMean = null;
            }


            ctrl.updatePhasorChart(phasorId);

        });

        
    }

    // #endregion

    // #region Options Functions
    changeMapBackground() {
        var ctrl = this;

        ctrl.$scope.tileLayer.remove();
        ctrl.$scope.tileLayer = L.tileLayer(tileServers[this.panel.mapBackground].url, tileServers[this.panel.mapBackground].options);
        ctrl.$scope.tileLayer.addTo(this.$scope.mapContainer);
    }

    updateZoom() {
        var ctrl = this;

        ctrl.$scope.mapContainer.options.minZoom = (ctrl.panel.lockMap == 'No' ? ctrl.panel.minZoom : ctrl.panel.zoomLevel);
        ctrl.$scope.mapContainer.options.maxZoom = (ctrl.panel.lockMap == 'No' ? ctrl.panel.maxZoom : ctrl.panel.zoomLevel);

        ctrl.$scope.mapContainer.setZoom(ctrl.panel.zoomLevel);
    }

    updateMapView() {
        var ctrl = this;

        ctrl.$scope.mapContainer.fitBounds([
            [ctrl.panel.maxLatitude, ctrl.panel.maxLongitude],
            [ctrl.panel.minLatitude, ctrl.panel.minLongitude]
        ]);
    }

    lockMap() {
        var ctrl = this;

        ctrl.$scope.mapContainer.remove();
        ctrl.$scope.mapContainer = null;
        ctrl.createMap();
        ctrl.plotMetaData();
    }

    boundToMarkers() {
        var ctrl = this;

        var markerGroup = new L.featureGroup(ctrl.$scope.circleMarkers);
        if (markerGroup.getBounds().isValid())
            ctrl.$scope.mapContainer.fitBounds(markerGroup.getBounds());

        var bounds = ctrl.$scope.mapContainer.getBounds();
        ctrl.panel.maxLongitude = bounds._southWest.lng;
        ctrl.panel.maxLatitude = bounds._northEast.lat;
        ctrl.panel.minLatitude = bounds._southWest.lat;
        ctrl.panel.minLongitude = bounds._northEast.lng;
    }
    //#endregion

    // #region Angular Tag Functions
    getRange(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    }
    // #endregion
    

}

PhasorMapCtrl.templateUrl = 'partials/module.html';
