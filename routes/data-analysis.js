(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');

  function getChartsData(tips, month, year) {

    //   var data = google.visualization.arrayToDataTable([
    //   ['Year', 'Sales', 'Expenses'],
    //   ['2004',  1000,      400],
    //   ['2005',  1170,      460],
    //   ['2006',  660,       1120],
    //   ['2007',  1030,      540]
    // ]);
    //
    var i = 0;
    var crimeTypes = ["Assault", "Child Abuse", "Elderly Abuse", "Domestic Violence", "Drugs", "Homicide", "Animal Abuse",
      "Robbery", "Sex Offenses", "Bullying", "Police Misconduct", "Bribery", "Vehicle Theft", "Vandalism",
      "Auto Accident", "Civil Rights", "Arson", "Other"
    ];

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];

    var tipsTypeChart = {};
    var tipsDateChart = {};

    //Initialize # of Tips vs CrimeType chart
    tipsTypeChart.type = 'PieChart';
    tipsTypeChart.options = {
      'title': 'Tip Count vs Crime Type'
    };
    tipsTypeChart.data = {
      "cols": [{
        id: "t",
        label: "Crime Type",
        type: "string"
      }, {
        id: "s",
        label: "Tip Count",
        type: "number"
      }],
      "rows": []
    };
    tipsTypeChart.dataArray = [];
    for (i = 0; i < crimeTypes.length; i++) {
      tipsTypeChart.data.rows.push({
        c: [{
          v: crimeTypes[i]
        }, {
          v: 0
        }]
      });
      tipsTypeChart.dataArray.push({
        a: crimeTypes[i],
        b: 0
      });
    }

    //Create column chart with months of the year
    if (isNaN(month)) {
      //Initialize # of Tips vs Date chart
      tipsDateChart.type = 'ColumnChart';
      tipsDateChart.options = {
        'title': 'Tip Count vs Month'
      };
      tipsDateChart.data = {
        "cols": [{
          id: "t",
          label: "Month",
          type: "string"
        }, {
          id: "s",
          label: "Tip Count",
          type: "number"
        }],
        "rows": []
      };
      tipsDateChart.dataArray = [];
      for (i = 0; i < months.length; i++) {
        tipsDateChart.data.rows.push({
          c: [{
            v: months[i]
          }, {
            v: 0
          }]
        });
        tipsDateChart.dataArray.push({
          a: months[i],
          b: 0
        });
      }
    }
    //Create line chart with days of month
    else {
      //Initialize # of Tips vs Date chart
      tipsDateChart.type = 'LineChart';
      tipsDateChart.options = {
        title: 'Tip Count vs Date (UTC Time)'
      };
      tipsDateChart.data = {
        "cols": [{
          id: "t",
          label: "Date",
          type: "string"
        }, {
          id: "s",
          label: "Tip Count",
          type: "number"
        }],
        "rows": []
      };
      tipsDateChart.dataArray = [];

      var tempDate = new Date(year, month);
      while (tempDate.getUTCMonth() === month) {
        tipsDateChart.data.rows.push({
          c: [{
            v: tempDate.getUTCDate()
          }, {
            v: 0
          }]
        });
        tipsDateChart.dataArray.push({
          a: tempDate.getUTCDate(),
          b: 0
        });
        tempDate.setDate(tempDate.getUTCDate() + 1);
      }
    }

    //Fill out data for both charts
    for (i = 0; i < tips.length; i++) {
      var crimePos = tips[i].attributes.crimeListPosition;
      var monthPos = tips[i].createdAt.getUTCMonth();
      var date = tips[i].createdAt.getUTCDate() - 1; //minus 1 to match the position on the array
      tipsTypeChart.data.rows[crimePos].c[1].v++;
      tipsTypeChart.dataArray[crimePos].b++;
      //Feel the column chart.
      if (isNaN(month)) {
        tipsDateChart.data.rows[monthPos].c[1].v++;
        tipsDateChart.dataArray[monthPos].b++;
      } else {
        tipsDateChart.data.rows[date].c[1].v++;
        tipsDateChart.dataArray[date].b++;
      }
    }

    return {
      tipsTypeChart: tipsTypeChart,
      tipsDateChart: tipsDateChart
    };
  }

  router
    .use(util.restrict)
    .get('/', function (request, response) {
      var charts = {},
        year = request.query.year,
        month = request.query.month,
        isMonthSelected = !isNaN(month);

      function analyzeData() {
        var clientId = request.session.user.homeClient.objectId;

        //If not month was provided, set month to January
        if (!isMonthSelected) {
          month = 0;
        }
        //Make sure the values are integers
        else if (typeof month == 'string' || month instanceof String) {
          month = parseInt(month);
        }
        if (typeof year == 'string' || year instanceof String) {
          year = parseInt(year);
        }

        //Create query
        var tipQuery = new db.Query(TipReport);
        //Filter by clientId
        tipQuery.equalTo('clientId', {
          __type: "Pointer",
          className: "Client",
          objectId: clientId
        });
        tipQuery.limit(1000);
        if (!isMonthSelected) {
          tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
          tipQuery.lessThanOrEqualTo("createdAt", new Date(year + 1, month));
        } else {
          tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
          // If month is 11(December), upper bound will be january 1 of the next year
          tipQuery.lessThanOrEqualTo("createdAt", new Date(month !== 11 ? year : year + 1, (month + 1) % 12));
        }
        return tipQuery.find();

      }

      analyzeData().then(function (tips) {

        charts.tipCount = tips.length;

        if (isMonthSelected) {
          charts = getChartsData(tips, month, year);
        } else {
          charts = getChartsData(tips);
        }

        response.send(charts);
      }, function (error) {
        response.status(503).send(error);
      });
    });


  module.exports = router;
})();
