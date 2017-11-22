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
//import * as L from '../lib/leaflet';
//import * as pD from '../lib/leaflet.polylineDecorator.js';
import _ from 'lodash';
import moment from 'moment';
import '../css/leaflet.css!';
import { TileServers } from './../js/constants';

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
        this.panel.mapBackgrounds = Object.keys(TileServers);
        this.panel.mapBackground  = (this.panel.mapBackground != undefined ? this.panel.mapBackground : this.panel.mapBackgrounds[0]);
        this.panel.maxZoom        = TileServers[this.panel.mapBackground].options.maxZoom;
        this.panel.minZoom =        (TileServers[this.panel.mapBackground].options.minZoom != undefined ? TileServers[this.panel.mapBackground].options.minZoom : 2)
        this.panel.zoomLevel =      (this.panel.zoomLevel       != undefined ? this.panel.zoomLevel     : TileServers[this.panel.mapBackground].options.maxZoom);
        this.panel.lockMap =        (this.panel.lockMap         != undefined ? this.panel.lockMap       : 'No'  );
        this.panel.maxLongitude =   (this.panel.maxLongitude    != undefined ? this.panel.maxLongitude  : -125  );
        this.panel.maxLatitude =    (this.panel.maxLatitude     != undefined ? this.panel.maxLatitude   : 24    );
        this.panel.minLatitude =    (this.panel.minLatitude     != undefined ? this.panel.minLatitude   : 50    );
        this.panel.minLongitude =   (this.panel.minLongitude    != undefined ? this.panel.minLongitude  : -66   );
        this.panel.circleRadius = (this.panel.circleRadius != undefined ? this.panel.circleRadius : 50);
        this.panel.angleMarkerWidth = (this.panel.angleMarkerWidth != undefined ? this.panel.angleMarkerWidth : 5);  
        this.panel.minAngleMarkerWidth = (this.panel.minAngleMarkerWidth != undefined ? this.panel.minAngleMarkerWidth : 1);  
        this.panel.maxAngleMarkerWidth = (this.panel.maxAngleMarkerWidth != undefined ? this.panel.maxAngleMarkerWidth : 1);  
        this.panel.showMinAngle = (this.panel.showMinAngle != undefined ? this.panel.showMinAngle : true);
        this.panel.showMaxAngle = (this.panel.showMaxAngle != undefined ? this.panel.showMaxAngle : true);

        this.panel.useReferenceValue = (this.panel.useReferenceValue != undefined ? this.panel.useReferenceValue : false);
        this.panel.referencePointTag = (this.panel.referencePointTag != undefined ? this.panel.referencePointTag : '');  
        this.panel.useAngleMean = (this.panel.useAngleMean != undefined ? this.panel.useAngleMean : false);
        this.panel.angleMeanTimeWindow = (this.panel.angleMeanTimeWindow != undefined ? this.panel.angleMeanTimeWindow : '5');
        this.panel.showLegend = (this.panel.showLegend != undefined ? this.panel.showLegend : false);

        // Scope Variables
        this.$scope.tileLayer = null;
        this.$scope.mapContainer = null;
        this.$scope.circleMarkers = [];
        this.$scope.data = [];
    }
    // #endregion

    // #region Events from Graphana Handlers
    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/gridprotectionalliance-phasormap-panel/partials/editor.html', 2);
        //console.log('init-edit-mode');
    }

    onPanelTeardown() {
        if (this.map) {
            this.map.off('zoomend');
            this.map.off('moveend');
        }
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

        ctrl.$scope.data = data;

        ctrl.createMap();

        ctrl.plotPhasorData(data);
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

    updatePhasorChart(div, data) {
        var ctrl = this;

        var canvas = $(div).children();
        var context = canvas[0].getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        var center = { x: canvas.width() / 2, y: canvas.height() / 2 };
        var chartRadius = ctrl.panel.circleRadius;

        function drawBackground()
        {
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

            var headlen = 10;   // length of head in pixels
            var x = chartRadius * Math.cos(radians) + center.x;
            var y = chartRadius * Math.sin(radians) + center.y;

            context.lineWidth = 5;
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
            context.lineWidth = 1;

            context.strokeStyle = "#FFFF00";
            context.beginPath();
            context.arc(center.x, center.y, chartRadius*(magnitude/2), 0, 2 * Math.PI);
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

        if(ctrl.panel.showMinAngle) drawLine(data.minanglevalue, "#FF0000", ctrl.panel.minAngleMarkerWidth);
        if(ctrl.panel.showMaxAngle) drawLine(data.maxanglevalue, "#FF0000", ctrl.panel.maxAngleMarkerWidth);
        drawLine(data.anglevalue, "#000000", ctrl.panel.angleMarkerWidth);

        //if (phasor.angleMean)
        //    drawAverageLine(phasor.angleMean);
    }

    // #endregion

    // #region Data
    plotPhasorData(data) {
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
            var circle = L.marker([element.latitude, element.longitude], { icon: divIcon });
            ctrl.$scope.circleMarkers.push(circle);
            circle.addTo(ctrl.$scope.mapContainer);
            ctrl.updatePhasorChart(circle._icon, element);

            if (element.tolongitude != "" && element.tolatitude != "") {
                var line;
                if(element.powervalue >= 0)
                    line = L.polyline([[element.latitude, element.longitude], [element.tolatitude, element.tolongitude]], { color: 'red' }).on('click', function (event) {
                        console.log(element)
                        var popup = window.open("http://localhost:3000/dashboard/db/templating?var-AngleA=" + encodeURIComponent(element.anglepointtag) + "&var-AngleB=" + encodeURIComponent(element.toanglepointtag) + "&var-LineMW=" + encodeURIComponent(element.powerpointtag), "_blank");
                    });
                else
                    line = L.polyline([[element.tolatitude, element.tolongitude], [element.latitude, element.longitude]], { color: 'red' }).on('click', function (event) {
                        console.log(element)
                        var popup = window.open("http://localhost:3000/dashboard/db/templating?var-AngleA=" + encodeURIComponent(element.anglepointtag) + "&var-AngleB=" + encodeURIComponent(element.toanglepointtag) + "&var-LineMW=" + encodeURIComponent(element.powerpointtag), "_blank");
                    });

                var decorator = L.polylineDecorator(line, {
                    patterns: [
                        { offset: '60%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: 'red', fillOpacity: 1, weight: 0 } }) }
                    ]
                });

                ctrl.$scope.circleMarkers.push(line);
                ctrl.$scope.circleMarkers.push(decorator);

                line.addTo(ctrl.$scope.mapContainer);
                decorator.addTo(ctrl.$scope.mapContainer);
            }
        });

    }

    // #endregion

    // #region Options Functions
    changeMapBackground() {
        var ctrl = this;

        ctrl.$scope.tileLayer.remove();
        ctrl.$scope.tileLayer = L.tileLayer(TileServers[this.panel.mapBackground].url, TileServers[this.panel.mapBackground].options);
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

    fixAngle(angle) {
        if (angle > -180 && angle <= 180) return angle;
        else if (angle <= -180) return 360 + angle;
        else if (angle > 180) return angle - 360;
    }
}

PhasorMapCtrl.templateUrl = 'partials/module.html';
