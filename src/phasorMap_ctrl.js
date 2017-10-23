"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("../../../../public/app/plugins/sdk");
var PhasorMapCtrl = (function (_super) {
    __extends(PhasorMapCtrl, _super);
    function PhasorMapCtrl($scope, $injector, $rootScope) {
        return _super.call(this, $scope, $injector) || this;
    }
    return PhasorMapCtrl;
}(sdk_1.MetricsPanelCtrl));
exports.PhasorMapCtrl = PhasorMapCtrl;
//# sourceMappingURL=phasorMap_ctrl.js.map