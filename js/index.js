'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
   _inherits(App, _React$Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = {
         dataset: null
      };
      _this.fetchData = _this.fetchData.bind(_this);
      _this.buildMap = _this.buildMap.bind(_this);
      _this.temperatureToColor = _this.temperatureToColor.bind(_this);
      return _this;
   }

   App.prototype.fetchData = function fetchData() {
      var _this2 = this;

      var url = 'https://raw.githubusercontent.com/hongyi0220/ProjectReferenceData/master/global-temperature.json';
      fetch(url).then(function (response) {
         return response.json();
      }).then(function (responseJson) {
         return _this2.setState({ dataset: responseJson }, function () {
            return _this2.buildMap(_this2.state.dataset);
         });
      });
   };

   App.prototype.temperatureToColor = function temperatureToColor(temp) {
      if (temp < 2) return 'rgb(50,12,125)';else if (temp < 2.5) return 'rgb(2,13,128)';else if (temp < 3) return 'rgb(7,57,177)';else if (temp < 3.5) return 'rgb(11,36,251)';else if (temp < 4) return 'rgb(22,130,251)';else if (temp < 4.5) return 'rgb(33,191,252)';else if (temp < 5) return 'rgb(45,255,254)';else if (temp < 5.5) return 'rgb(42,246,199)';else if (temp < 6) return 'rgb(44,213,142)';else if (temp < 6.5) return 'rgb(24,161,97)';else if (temp < 7) return 'rgb(51,168,52)';else if (temp < 7.5) return 'rgb(54,198,56)';else if (temp < 8) return 'rgb(41,252,46)';else if (temp < 8.5) return 'rgb(205,253,52)';else if (temp < 9) return 'rgb(255,253,56)';else if (temp < 9.5) return 'rgb(237,236,133)';else if (temp < 10) return 'rgb(227,203,109)';else if (temp < 10.5) return 'rgb(219,173,82)';else if (temp < 11) return 'rgb(253,169,41)';else if (temp < 11.5) return 'rgb(252,86,31)';else if (temp < 12) return 'rgb(252,86,31)';else if (temp < 12.5) return 'rgb(198,8,19)';else if (temp < 13) return 'rgb(171,6,15)';else if (temp < 13.5) return 'rgb(145,4,11)';else if (temp < 14) return 'rgb(119,2,7)';
   };

   App.prototype.buildMap = function buildMap(dataset) {
      var _this3 = this;

      var width = 1000;
      var height = 500;
      var padding = 50;

      var monthlyData = dataset.monthlyVariance;
      var baseTemp = dataset.baseTemperature;
      var month = ['January', 'February', 'Marh', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      var svg = d3.select('.container').append('svg').attr('width', width).attr('height', height);

      // Largest variance: 5.228, smallest variance: -6.976
      // Lowest temperature: 1.684,
      // highest temperature: 13.888

      var domain = monthlyData.filter(function (d) {
         return d.month === 1;
      }).map(function (d) {
         return d.year;
      });

      var xScale = d3.scaleBand().domain(domain).range([padding, width - padding]);
      var yScale = d3.scaleBand().domain(monthlyData.filter(function (d) {
         return d.year === 2010;
      }).map(function (d) {
         return d.month;
      })).range([padding, height - padding]);

      svg.selectAll('rect').data(monthlyData).enter().append('rect').attr('x', function (d) {
         return xScale(d.year);
      }).attr('y', function (d) {
         return yScale(d.month);
      }).attr('width', xScale.bandwidth()).attr('height', (height - padding * 2) / 12).attr('fill', function (d) {
         return _this3.temperatureToColor(baseTemp + d.variance);
      }).attr('class', 'bar').append('title').text(function (d) {
         return baseTemp + d.variance + '℃' + '\n' + d.year + '/' + month[d.month - 1];
      });

      var xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(function (d, i) {
         return !(i % 10);
      }));

      svg.append('g').attr('transform', 'translate(0,' + (height - padding) + ')').call(xAxis).selectAll('text').style('text-anchor', 'middle').style('font-family', 'Ropa Sans');

      var yAxis = d3.axisLeft(yScale.domain(monthlyData.map(function (d) {
         return month[d.month - 1];
      })));

      svg.append('g').attr('transform', 'translate(' + padding + ',0)').call(yAxis).style('font-family', 'Ropa Sans');

      // Labels
      svg.append('text').text('Month').attr('x', padding - 3).attr('y', -padding - 1.5).attr('transform', 'rotate(90)').attr('class', 'axis-label');

      svg.append('text').text('Year').attr('x', width - padding * 2.1).attr('y', height - padding).attr('class', 'axis-label');

      // Legend
      (function () {
         var colors = [];
         var iteration = 0;
         for (var c = 1.5; c < 14; c += 0.5) {
            iteration++;
            colors.push(_this3.temperatureToColor(c));
            svg.append('text').text(c.toFixed(1)).attr('x', width / 2 - padding * 1.32 + iteration * 20).attr('y', height - 3).attr('font-size', '0.6em');
         };
         for (var i = 0; i < 25; i++) {
            svg.append('rect').attr('width', 20).attr('height', 20).attr('x', width / 2 - padding + i * 20).attr('y', height - padding / 1.6).attr('fill', colors[i]);
         }
      })();
   };

   App.prototype.componentDidMount = function componentDidMount() {
      this.fetchData();
   };

   App.prototype.render = function render() {
      return React.createElement(
         'div',
         { className: 'container' },
         React.createElement(
            'h1',
            null,
            'Global Heatmap'
         ),
         React.createElement(
            'h2',
            null,
            'Global average temperature compared to baseline global average temperature (8.66℃) from 1951 - 1980'
         )
      );
   };

   return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));