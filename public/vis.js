import 'plugins/enhanced_tilemap/lib/angular-bootstrap/js/accordion-tpls.js';
import 'plugins/enhanced_tilemap/bower_components/angularjs-slider/dist/rzslider.css';
import 'plugins/enhanced_tilemap/bower_components/angularjs-slider/dist/rzslider.js';
import 'plugins/enhanced_tilemap/bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min';
import _ from 'lodash';
import { supports } from 'ui/utils/supports';
import { AggResponseGeoJsonProvider } from 'ui/agg_response/geo_json/geo_json';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';

import 'plugins/enhanced_tilemap/vis.less';
import 'plugins/enhanced_tilemap/lib/jquery.minicolors/minicolors';
import 'plugins/enhanced_tilemap/directives/bands';
import 'plugins/enhanced_tilemap/directives/savedSearches';
import 'plugins/enhanced_tilemap/directives/tooltipFormatter';
import 'plugins/enhanced_tilemap/directives/wmsOverlays';
import 'plugins/enhanced_tilemap/tooltip/popupVisualize';
import 'plugins/enhanced_tilemap/tooltip/popupVisualize.less';
import 'plugins/enhanced_tilemap/visController';

import optionsTemplate from 'plugins/enhanced_tilemap/options.html';
import visData from 'plugins/enhanced_tilemap/vis.html';

VisTypesRegistryProvider.register(EnhancedTileMapVisProvider);


function EnhancedTileMapVisProvider(Private, getAppState, courier, config) {

  const Schemas = Private(VisSchemasProvider);
  const geoJsonConverter = Private(AggResponseGeoJsonProvider);
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createAngularVisualization({

    name: 'enhanced_tilemap',
    title: 'Enhanced Coordinate Map',
    icon: 'fa-map-marker',
    description: 'Coordinate map plugin that provides better performance, complete geospatial query support, and more features than the built in Coordinate map.',
    category: CATEGORY.MAP,
    visConfig: {
      defaults: {
        mapType: 'Scaled Circle Markers',
        collarScale: 1.5,
        scaleType: 'Dynamic - Linear',
        scaleBands: [{
          low: 0,
          high: 10,
          color: "#ffffcc"
        }],
        scrollWheelZoom: false,
        isDesaturated: true,
        addTooltip: true,
        heatMaxZoom: 16,
        heatMinOpacity: 0.1,
        heatRadius: 25,
        heatBlur: 15,
        heatNormalizeData: true,
        mapZoom: 2,
        mapCenter: [15, 5],
        markers: [],
        overlays: {
          savedSearches: [],
          wmsOverlays: []
        },
        wms: config.get('visualization:tileMap:WMSdefaults')
    },
    template: visData
  },
  responseConverter: geoJsonConverter,
  responseHandler: 'basic',
  implementsRenderComplete: true,
  editorConfig: {
    collections : {
      mapTypes: ['Scaled Circle Markers', 'Shaded Circle Markers', 'Shaded Geohash Grid', 'Heatmap'],
      scaleTypes: ['Dynamic - Linear', 'Dynamic - Uneven', 'Static'],
      canDesaturate: !!supports.cssFilters
    },
    optionsTemplate: optionsTemplate,
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Value',
        min: 1,
        max: 1,
        aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality'],
        defaults: [
          { schema: 'metric', type: 'count' }
        ]
      },
      {
        group: 'buckets',
        name: 'segment',
        title: 'Geo Coordinates',
        aggFilter: 'geohash_grid',
        min: 1,
        max: 1
      }
    ])},

    hierarchicalData: function (vis) {
      return false;
    }
  });
}

export default EnhancedTileMapVisProvider;
