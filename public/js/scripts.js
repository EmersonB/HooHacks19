/* eslint-disable comma-spacing */
var config = {
  apiKey: 'AIzaSyAGR4ionKdXWPFxJQTUKxBHsJ-5RGiMtFU',
  authDomain: 'stasis-aff23.firebaseapp.com',
  databaseURL: 'https://stasis-aff23.firebaseio.com',
  projectId: 'stasis',
  storageBucket: 'stasis.appspot.com',
  messagingSenderId: '911680701800'
}

firebase.initializeApp(config)

Chart.defaults.global.defaultFontFamily = 'Quicksand'
Chart.defaults.global.elements.point = {
  radius: 8,
  backgroundColor: '#C5EADE',
  borderColor: '#878787',
  hoverRadius: 8,
  hoverBorderWidth: 2
}

$(document).ready(function () {
  feather.replace()
  setupBalanceChart()
  setupCenterOfMassChart()
  setupRadarChart()
})

function setupBalanceChart () {
  var ctx = document.getElementById('balance-chart').getContext('2d')
  var myChart = new Chart(ctx, {
    scaleLineColor: 'rgba(0,0,0,0)',
    type: 'line',
    data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{
        data: [86,114,106,106,107,111,133,221,783,2478],
        label: 'Balance Metric',
        borderColor: '#95D9C3',
        fill: false
      }]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: false,
        text: 'Balance Metric',
        fontSize: '22',
        padding: '10'
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Balance',
            fontStyle: 'bold',
            fontSize: '16'
          },
          gridLines: {
            lineWidth: 2
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time',
            fontStyle: 'bold',
            fontSize: '16'
          },
          gridLines: {
            lineWidth: 2
          }
        }]
      },
      maintainAspectRatio: false
    }
  })
}

function setupCenterOfMassChart () {
  var rightFoot = new Image()
  rightFoot.src = 'img/rightfoot.png'
  var leftFoot = new Image()
  leftFoot.src = 'img/leftfoot.png'
  var ctx2 = document.getElementById('mass-chart').getContext('2d')
  var footChart = new Chart(ctx2, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter Dataset',
        data: [{
          x: 0.5,
          y: 0
        }],
        pointRadius: 0,
        pointHoverRadius: 20,
        pointHitRadius: 20,
        pointStyle: rightFoot
      },
      {
        label: 'Scatter Dataset',
        data: [{
          x: -0.5,
          y: 0
        }],
        pointRadius: 0,
        pointHoverRadius: 20,
        pointHitRadius: 20,
        pointStyle: leftFoot
      }]
    },
    options: {
      maintainAspectRatio: false,
      annotation: {
        annotations: [
          {
            drawTime: 'afterDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: 50,
            borderColor: '#005a99',
            borderWidth: 4,
            label: {
              enabled: false
            }
          },
          {
            drawTime: 'afterDraw',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-1',
            value: 50,
            borderColor: '#005a99',
            borderWidth: 4,
            label: {
              enabled: false
            }
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            min: -1,
            stepSize: 1,
            max: 1
          },
          gridLines: {
            lineWidth: 2
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            stepSize: 1,
            min: -1,
            max: 1
          },
          gridLines: {
            lineWidth: 2
          }
        }]
      }
    }
  })
}

function setupRadarChart () {
  var ctx = document.getElementById('radar-chart').getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Forward', 'Right', 'Back', 'Left'],
      datasets: [{
        label: 'My First dataset',
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      title: {
        display: false
      },
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
    }
  })
}

function randomScalingFactor () {
  return Math.round(Math.random() * 100)
}
