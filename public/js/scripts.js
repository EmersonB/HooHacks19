const loopInterval = 3000
const calcWindow = 30

var config = {
  apiKey: 'AIzaSyAGR4ionKdXWPFxJQTUKxBHsJ-5RGiMtFU',
  authDomain: 'stasis-aff23.firebaseapp.com',
  databaseURL: 'https://stasis-aff23.firebaseio.com',
  projectId: 'stasis',
  storageBucket: 'stasis.appspot.com',
  messagingSenderId: '911680701800'
}

firebase.initializeApp(config)
const db = firebase.firestore()
const collection = db.collection('feed')

Chart.defaults.global.defaultFontFamily = 'Quicksand'
Chart.defaults.global.elements.point = {
  radius: 8,
  backgroundColor: '#C5EADE',
  borderColor: '#878787',
  hoverRadius: 8,
  hoverBorderWidth: 2
}

var model
var firstTime = true
var balChart
var comChart
var radChart
var rightFoot = new Image()
rightFoot.src = 'img/rightfoot.png'
var leftFoot = new Image()
leftFoot.src = 'img/leftfoot.png'

var order = ['back', 'forward', 'left', 'normal', 'right']
var rawData = {}
var timestamps = []
var endPoint = 0
var startPoint = 0
var mlInput = []
var mlOutput = []
var aggregatedOutput = [] // sum of count of classes
var finalCount = [0, 0, 0, 0, 0]
var radarCount = [0, 0, 0, 0]

var balanceChartLabels = []
var balanceChartData = []

var coords = [0, 0]

$(document).ready(function () {
  feather.replace()
  start()
})

async function start () {
  model = await tf.loadModel('model.json')
  loop = setInterval(retrieveData, loopInterval)
  retrieveData()
}

function retrieveData () {
  order = ['back', 'forward', 'left', 'normal', 'right']
  rawData = {}
  timestamps = []
  endPoint = 0
  startPoint = 0
  mlInput = []
  mlOutput = []
  aggregatedOutput = [] // sum of count of classes
  finalCount = [0, 0, 0, 0, 0]

  balanceChartLabels = []
  balanceChartData = []

  coords = [0, 0]
  collection.get().then(snapshot => {
    rawData = {}
    snapshot.forEach(doc => {
      let data = doc.data()
      rawData[doc.id] = data
    })
    processData()
  })
}

function processData () {
  timestamps = Object.keys(rawData)
  if (timestamps.length >= 3) {
    endPoint = timestamps.length - 3
    startPoint = Math.max(endPoint - calcWindow, 0)

    for (var i = startPoint; i <= endPoint; i++) {
      let one = [rawData[timestamps[i]]['accex'],
        rawData[timestamps[i]]['accey'],
        rawData[timestamps[i]]['accez'],
        rawData[timestamps[i]]['gyrox'],
        rawData[timestamps[i]]['gyroy'],
        rawData[timestamps[i]]['gyroz']]

      let two = [rawData[timestamps[i]]['accex'],
        rawData[timestamps[i]]['accey'],
        rawData[timestamps[i]]['accez'],
        rawData[timestamps[i]]['gyrox'],
        rawData[timestamps[i]]['gyroy'],
        rawData[timestamps[i]]['gyroz']]

      let three = [rawData[timestamps[i]]['accex'],
        rawData[timestamps[i]]['accey'],
        rawData[timestamps[i]]['accez'],
        rawData[timestamps[i]]['gyrox'],
        rawData[timestamps[i]]['gyroy'],
        rawData[timestamps[i]]['gyroz']]

      let combined = one.concat(two, three)
      mlInput.push(combined)
    }

    getMlOutput()

    for (var i = 0; i < mlOutput.length; i++) {
      aggregatedOutput.push(mlOutput[i].indexOf(_.max(mlOutput[i])))
    }

    balanceChart()
    centerOfMassChart()
    radarChart()
    finalEval()

    if (firstTime) {
      setupBalanceChart()
      setupCenterOfMassChart()
      setupRadarChart()
      firstTime = false
      $('#welcome').hide()
    } else {
      balChart.options = {
        ...balChart.options,
        animation: {
          duration: 0
        }
      }
      comChart.options = {
        ...comChart.options,
        animation: {
          duration: 0
        }
      }
      radChart.options = {
        ...radChart.options,
        animation: {
          duration: 0
        }
      }
      balChart.data.labels = balanceChartLabels
      balChart.data.datasets = [{
        data: balanceChartData,
        label: 'Balance Metric',
        borderColor: '#95D9C3',
        fill: false
      }]
      comChart.data.datasets = [
        {
          label: 'Center of Mass',
          data: [{
            x: coords[0],
            y: coords[1]
          }]
        },
        {
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

      radChart.data.datasets = [{
        label: 'My First dataset',
        data: radarCount
      }]

      balChart.update()
      comChart.update()
      radChart.update()
    }
  }
}

function getMlOutput () {
  // _.forEach(mlInput, val => {
  //   mlOutput.push(model.predict([val]))
  // })
  let tensors = tf.tensor(mlInput)
  mlOutput = model.predictOnBatch(tensors).arraySync()
}

function balanceChart () {
  for (var i = 0; i < endPoint - startPoint; i++) {
    balanceChartLabels.push(moment(parseFloat(timestamps[startPoint+i])).format('LTS'))
    balanceChartData.push(mlOutput[i][3])
  }
}

function setupBalanceChart () {
  var ctx = document.getElementById('balance-chart').getContext('2d')
  balChart = new Chart(ctx, {
    scaleLineColor: 'rgba(0,0,0,0)',
    type: 'line',
    data: {
      labels: balanceChartLabels,
      datasets: [{
        data: balanceChartData,
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

function centerOfMassChart () {
  for (var i = 0; i < mlOutput.length; i++) {
    coords[0] += mlOutput[i][4] - mlOutput[i][2]
    coords[1] += mlOutput[i][1] - mlOutput[i][0]
  }
  coords[0] /= mlOutput.length
  coords[1] /= mlOutput.length
  coords[0] = Math.max(Math.min(coords[0], 1), -1)
  coords[1] = Math.max(Math.min(coords[1], 1), -1)
}

function setupCenterOfMassChart () {
  var ctx2 = document.getElementById('mass-chart').getContext('2d')
  comChart = new Chart(ctx2, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Center of Mass',
          data: [{
            x: coords[0],
            y: coords[1]
          }]
        },
        {
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

function radarChart () {
  for (let i = 0; i < order.length; i++) {
    finalCount[i] = aggregatedOutput.filter((n) => (n === i)).length
  }
  radarCount[0] = finalCount[1]
  radarCount[1] = finalCount[4]
  radarCount[2] = finalCount[0]
  radarCount[3] = finalCount[2]
}

function setupRadarChart () {
  var ctx = document.getElementById('radar-chart').getContext('2d')
  radChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['forward', 'right', 'back', 'left'],
      datasets: [{
        label: 'My First dataset',
        data: radarCount
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
        },
        pointLabels: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    }
  })
}

function finalEval () {
  let total = _.sum(finalCount)
  let maxLeaning = finalCount.indexOf(_.max(finalCount))
  $('#eval').text(order[maxLeaning] + ' leaning')
  $('#posture-demo').attr('src', 'img/' + order[maxLeaning] + '.png')

  $('#right').text((finalCount[4] / total).toFixed(2))
  $('#left').text((finalCount[2] / total).toFixed(2))
  $('#for').text((finalCount[1] / total).toFixed(2))
  $('#back').text((finalCount[0] / total).toFixed(2))
}
