/**
 * @file 画商圈组件 mapcircle.js
 * @author yangluguang@baidu.com
 *    modified by wangjuan01 <wangjuan01@iwaimai.baidu.com>
 */

/* globals module */
/* globals BMap */
/* globals BMapLib */

/*eslint-disable */

'use strict';
const geocoder = new BMap.Geocoder();
const mercatorTools = new BMap.MercatorProjection();

export const getLonlat = function (obj) {
  var lonlat = mercatorTools.pointToLngLat(
    new BMap.Pixel(obj.x, obj.y)
  );
  lonlat = {
    longitude: lonlat.lng,
    latitude: lonlat.lat
  }
  return lonlat;
}

export const getMercator = function (obj) {
  var mercator = mercatorTools.lngLatToPoint(
    new BMap.Point(obj.lng, obj.lat)
  );
  return mercator;
}

export const MapCircle = function (id) {
  var me = this;
  me.id = id;
  me.clearAll();
  me.init();
}

MapCircle.prototype = {
  constructor: MapCircle,
  level: 11,
  // 初始化
  init: function () {
    var me = this;
    me.map = me.map || new BMap.Map(me.id, {
      enableMapClick: false
    });
    me.map.enableScrollWheelZoom();
    me.map.disableDoubleClickZoom();
    /* global BMAP_ANCHOR_BOTTOM_RIGHT */
    me.map.addControl(new BMap.MapTypeControl({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT
    }));
    me.map.addControl(new BMap.ScaleControl());
    me.map.addControl(new BMap.NavigationControl());

    me.initDrawing();

    me.map.addEventListener('zoomend', function () {
      var labels = [].concat(me.markerLabels, me.polygonLabels, me.backPolygonLabels)
      if (labels && labels.length) {
        labels.forEach(function (label) {
          me.map.removeOverlay(label);
        });
      }
      me.map.getZoom() >= 11 && me.drawAllLabels(labels);
    });
  },
  // 初始化绘制管理类
  initDrawing: function () {
    var me = this;
    me.drawingManager = me.drawingManager || new BMapLib.DrawingManager(me.map, {
      drawingMode: BMAP_DRAWING_POLYGON,
      isOpen: false,
      markerOptions: {
        enableDragging: true
      }
    });
    me.drawingManager.addEventListener('polygoncomplete', function (e, polygon) {
      if (polygon.getPath().length < 3) {
        me.map.dispatchEvent('polygonsAdded');
        me.map.removeOverlay(polygon);
        return;
      };
      me.polygons.push(polygon);
      me.map.dispatchEvent('polygonsAdded');
      me.map.dispatchEvent('polygonsUpdate');
      me.drawingManager.close();
      polygon.enableEditing();
      polygon.addEventListener("lineupdate", function () {
        me.map.dispatchEvent('polygonsUpdate');
      });
    });
    me.drawingManager.addEventListener('markercomplete', function (e, marker) {
      me.markers.push(marker);
      me.map.dispatchEvent('markersAdded');
      me.map.dispatchEvent('markersUpdate');
      me.drawingManager.close();
      marker.addEventListener('dragend', function (e) {
        me.map.dispatchEvent('markersUpdate');
      });
    });
  },
  // 设置地图定位中心
  setCenter: function (cityName) {
    var me = this;
    var cname = cityName || '北京市';
    me.cityName = cname;
    if (me.lastCname !== cname) {
      me.lastCname = cname;
      me.map.reset();
      me.map.setCenter(cname);

      geocoder.getPoint(cname, function (data) {
        me.map.centerAndZoom(new BMap.Point(data.lng || 116.404, data.lat || 39.915), me.level);
      });
    }
  },
  // 画标记点数组
  drawMarkers: function (arr, enableDragging) {
    var me = this;
    var labelArr = [];
    me.markers = [];
    if (arr && arr.length) {
      for (var i = 0; i < arr.length; i++) {
        var point = arr[i];
        if (point.x && point.y) {
          point = getLonlat(point);
        }
        var lat = point.lat || point.latitude;
        var lng = point.lng || point.longitude;
        if (lat && lng) {
          var marker = new BMap.Marker(new BMap.Point(lng, lat), {
            enableDragging: enableDragging
          });
          me.map.addOverlay(marker);
          me.markers.push(marker);
          marker.addEventListener('dragend', function (e) {
            me.map.dispatchEvent('markersUpdate');
          });
          if (point.label) {
            let label = {
              label: point.label,
              point: new BMap.Point(lng, lat)
            };

            labelArr.push(label);
          }
        };
      }
    }
    me.drawMarkerLabel(labelArr);
    return me;
  },
  // 绘制标记点多边形标签
  drawMarkerLabel: function (arr) {
    var me = this;
    me.markerLabels = [];
    if (arr && arr.length) {
      arr.forEach(function (ele) {
        var label = new BMap.Label(ele.label, {
          position: ele.point,
          offset: new BMap.Size(-30, -10) // 设置文本偏移量
        });
        label.setStyle({
          color: '#fe022a',
          fontSize: '12px',
          fontFamily: '微软雅黑',
          fontWeight: 'bolder',
          border: 'none',
          padding: 0
        });
        me.map.addOverlay(label);
        me.markerLabels.push(label);
      });
    }

    return this;
  },
  // 画多边形数组
  drawPolygons: function (arr, enableEdit) {
    var me = this;
    var labelArr = [];
    me.polygons = [];
    if (arr && arr.length) {
      for (var j = 0; j < arr.length; j++) {
        var mapPoints = [];
        var points;

        if ($.isArray(arr[j])) {
          points = arr[j];
        } else {
          points = arr[j].points;
        }

        for (var i = 0; i < points.length; i++) {
          var point = points[i];
          if (point.x && point.y) {
            point = getLonlat(point);
          }
          var lat = point.lat || point.latitude;
          var lng = point.lng || point.longitude;
          if (lat && lng) {
            var mapPoint = new BMap.Point(lng, lat);
            mapPoints.push(mapPoint);
          };
        };
        if (!$.isArray(arr[j]) && arr[j].label) {
          let label = {
            label: arr[j].label,
            point: me.getPolygonCenterPosition(mapPoints)
          };

          labelArr.push(label);
        }
        var polygon = new BMap.Polygon(mapPoints, {
          strokeColor: '#0B71F5',
          fillColor: '#0B71F5',
          strokeWeight: 2,
          strokeOpacity: 1,
          fillOpacity: 0.3,
        });
        me.map.addOverlay(polygon);
        enableEdit && polygon.enableEditing();
        polygon.addEventListener("lineupdate", function () {
          me.map.dispatchEvent('polygonsUpdate');
        });
        me.polygons.push(polygon);
      };
    };
    me.drawPolygonLabels(labelArr);
    me.resetViewport();
    return me;
  },
  // 绘制多边形标签
  drawPolygonLabels: function (arr) {
    var me = this;
    me.polygonLabels = [];
    if (arr && arr.length) {
      arr.forEach(function (ele) {
        var label = new BMap.Label(ele.label, {
          position: ele.point,
          offset: new BMap.Size(-30, -10) // 设置文本偏移量
        });
        label.setStyle({
          color: '#fe022a',
          fontSize: '12px',
          fontFamily: '微软雅黑',
          fontWeight: 'bolder',
          border: 'none',
          padding: 0
        });
        me.map.addOverlay(label);
        me.polygonLabels.push(label);
      });
    }

    return this;
  },
  // 画背景多边形数组
  drawBackPolygons: function (arr) {
    var me = this;
    var labelArr = [];
    me.backPolygons = [];
    if (arr && arr.length) {
      for (var j = 0; j < arr.length; j++) {
        var mapPoints = [];
        var points = arr[j];

        if ($.isArray(arr[j])) {
          points = arr[j];
        } else {
          points = arr[j].points;
        }
        for (var i = 0; i < points.length; i++) {
          var point = points[i];
          if (point.x && point.y) {
            point = getLonlat(point);
          }
          var lat = point.lat || point.latitude;
          var lng = point.lng || point.longitude;
          if (lat && lng) {
            var mapPoint = new BMap.Point(lng, lat);
            mapPoints.push(mapPoint);
          };
        };

        var polygon = new BMap.Polygon(mapPoints, {
          strokeColor: '#0B71F5',
          fillColor: '#000000',
          strokeWeight: 1,
          strokeOpacity: 1,
          fillOpacity: 0.2,
          enableClicking: false
        });
        if (!$.isArray(arr[j]) && arr[j].label) {
          let label = {
            label: arr[j].label,
            point: me.getPolygonCenterPosition(mapPoints)
          };

          labelArr.push(label);
        }
        me.map.addOverlay(polygon);
        me.backPolygons.push(polygon);
      };
    };
    me.drawBackPolygonLabels(labelArr)
    return me;
  },
  // 绘制背景多边形标签
  drawBackPolygonLabels: function (arr) {
    var me = this;
    me.backPolygonLabels = [];
    if (arr && arr.length) {
      arr.forEach(function (ele) {
        var label = new BMap.Label(ele.label, {
          position: ele.point,
          offset: new BMap.Size(-30, -10) // 设置文本偏移量
        });
        label.setStyle({
          color: '#fe022a',
          fontSize: '12px',
          fontFamily: '微软雅黑',
          fontWeight: 'bolder',
          border: 'none',
          padding: 0
        });
        me.map.addOverlay(label);
        me.backPolygonLabels.push(label);
      });
    }

    return this;
  },
  // 绘制所有标签
  drawAllLabels: function (arr) {
    var me = this;
    if (arr && arr.length) {
      arr.forEach(function (label) {
        this.map.addOverlay(label);
      });
    }
    return this;
  },
  // 开启画标记点功能
  openDrawingMarker: function () {
    this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
    this.drawingManager.open();
    return this;
  },
  // 关闭画标记点功能
  closeDrawingMarker: function () {
    this.drawingManager.close();
    return this;
  },
  // 开启画多边形功能
  openDrawingPolygon: function () {
    this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    this.drawingManager.open();
    return this;
  },
  // 关闭画多边形功能
  closeDrawingPolygon: function () {
    this.drawingManager.close();
    return this;
  },
  // 清除全部
  clearAll: function () {
    this.clearMarkers().clearPolygons();
    return this;
  },
  // 清楚标记点及其标签
  clearMarkers: function () {
    for (var i in this.markers) {
      if (this.markers.hasOwnProperty(i)) {
        this.map.removeOverlay(this.markers[i]);
      }
    }
    this.markers = [];

    for (var j in this.markerLabels) {
      if (this.markerLabels.hasOwnProperty(j)) {
        this.map.removeOverlay(this.markerLabels[j]);
      }
    }
    this.markerLabels = [];

    return this;
  },
  // 清除多边形及其标签
  clearPolygons: function () {
    for (var i in this.polygons) {
      if (this.polygons.hasOwnProperty(i)) {
        this.map.removeOverlay(this.polygons[i]);
      }
    }
    this.polygons = [];

    for (var j in this.polygonLabels) {
      if (this.polygonLabels.hasOwnProperty(j)) {
        this.map.removeOverlay(this.polygonLabels[j]);
      }
    }
    this.polygonLabels = [];

    return this;
  },
  // 重置视窗
  resetViewport: function () {
    var views = [];
    if (this.polygons.length || this.markers.length) {
      if (this.polygons.length) {
        for (var i in this.polygons) {
          if (this.polygons.hasOwnProperty(i)) {
            var ps = this.polygons[i].getPath();
            views = views.concat(ps);
          }
        }
      }

      if (this.markers.length) {
        for (var i in this.markers) {
          if (this.markers.hasOwnProperty(i)) {
            var ps = this.markers[i].getPosition();
            views.push(ps);
          }
        }
      }
      var b = new BMap.Bounds(views[0], views[1]);
      for (var j = 2, len = views.length; j < len; j++) {
        b.extend(views[j]);
      }
      this.map.setCenter(b.getCenter());
      this.map.setViewport(views);
    } else {
      this.map.reset();
      this.map.setCenter(this.cityName);
    }

    return this;
  },
  // 获取所有多边形
  getPolygons: function () {
    return this.polygons;
  },
  // 获取所有背景多边形
  getBackPolygons: function () {
    return this.backPolygons;
  },
  // 获取所有标记点
  getMarkers: function () {
    return this.markers;
  },
  // 获取多边形中心位置
  getPolygonCenterPosition: function (points) {
    let max = {
      lng: -1,
      lat: -1
    };
    let min = {
      lng: 9999,
      lat: 9999
    };
    for (let i = 0, len = points.length; i < len; i++) {
      let lat = points[i].lat;
      let lng = points[i].lng;

      if (lng > max.lng) {
        max.lng = lng;
      }

      if (lng < min.lng) {
        min.lng = lng;
      }

      if (lat > max.lat) {
        max.lat = lat;
      }

      if (lat < min.lat) {
        min.lat = lat;
      }
    }
    return new BMap.Point((max.lng + min.lng) / 2, (max.lat + min.lat) / 2);
  },
};
/*eslint-enable */
