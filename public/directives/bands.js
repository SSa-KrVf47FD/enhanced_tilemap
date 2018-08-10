var module = require('ui/modules').get('kibana/enhanced_tilemap');
module.directive('bands', function () {
  function link (scope, element, attrs) {
    //colorbrewer YlOrRd-9
    const defaultColors = ["#daf7a6","#ffc300","#ff5733","#c70039","#900c3f","#581845"];
    scope.addBand = function() {
      let low = null;
      let high = null;
      if(scope.bands.length > 0) {
        const lastBand = scope.bands.slice(-1)[0];
        if(!isNaN(lastBand.high) && !isNaN(lastBand.low)) {
          low = parseInt(lastBand.high, 10);
          high = low + (parseInt(lastBand.high, 10) - parseInt(lastBand.low, 10));
        }
      }
      let colorIndex = scope.bands.length;
      if(colorIndex > defaultColors.length-1) colorIndex = defaultColors.length-1;
      scope.bands.push({
        low: low,
        high: high,
        color: defaultColors[colorIndex],
        customLabel: null
      });
    }

    scope.removeBand = function() {
      if(scope.bands.length > 0) scope.bands.pop();
    }

    //The end of one band marks the beginning of the next
    //Automatically update the next band's low value to reflect the change in the current band.
    scope.updateOlderSibling = function(index) {
      if(index !== scope.bands.length - 1) {
        scope.bands[index + 1].low = scope.bands[index].high;
      }
    }
  }

  return {
    restrict: 'E',
    scope: {
      bands: '='
    },
    template: require('./bands.html'),
    link: link
  };
});
