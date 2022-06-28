// on load, display data using promise
function init() {

    // test var
    // data = [{
    //     x: [1, 2, 3, 4, 5],
    //     y: [1, 2, 4, 8, 16]
    // }];

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (response) {
        // once we get a response, do stuff
        console.log("response below");
        console.log(response);

        var names = response.samples.map(x => x.id)
        // Append an option in the dropdown
        names.forEach(function (name) {
            d3.select('#selDataset')
                .append('option')
                .text(name)
        });

        // Use sample_values as the values for the bar chart.
        var sample_values = response.samples.map(x => x.sample_values);

        // Use otu_ids as the labels for the bar chart.
        var otu_ids = response.samples.map(x => x.otu_ids);

        // Use otu_labels as the hovertext for the chart.
        var otu_label = response.samples.map(x => x.otu_labels);

        // Get the top 10 OTU
        var sortedSample = sample_values.sort(function (a, b) { return b - a });
        var top_ten = sortedSample.map(x => x.slice(0, 10));

        var sorted_ids = otu_ids.sort(function (a, b) { return b - a });
        var top_ids = sorted_ids.map(x => x.slice(0, 10));
        var sorted_labels = otu_label.sort(function (a, b) { return b - a });
        var top_labels = sorted_labels.map(x => x.slice(0, 10));

        drawBarChart(top_ten, top_ids, top_labels)

        var firstID = response.metadata[0];
        drawMetaData(firstID);
        // otu_ids,sample_values,otu_label
        // let bubbledata = response.samples.filter(x => x.id === id);
        drawBubble(otu_ids, sample_values, otu_label)
        // bar chart
        // var trace1 = {
        //     x: top_ten[0],
        //     y: top_ids[0].map(x => "OTU" + x),
        //     text: top_labels[0],
        //     type: 'bar',
        //     orientation: 'h',
        //     transforms: [{
        //         type: 'sort',
        //         target: 'y',
        //         order: 'descending',
        //     }],
        //     marker: {
        //         opacity: 0.5,
        //         line: {
        //             width: 2
        //         }
        //     }
        // };
        // // bar layout
        // var layout1 = {
        //     title: '<b>Top 10 OTU</b>',
        // };

        // // draw bar chart
        // var traceData = [trace1];
        // var config = { responsive: true }
        // Plotly.newPlot('bar', traceData, layout1, config);

    });

    // sanity check
    // Plotly.newPlot("gauge", data);

}// end init

// call updatePlotly() with changes, not sure if redundant
d3.selectAll("#selDataset").on("change", updatePlotly);

function optionChanged(id) {
    updatePlotly(id);
};

// This function is called when a dropdown menu item is selected
function updatePlotly(id) {

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        console.log(data);
        // Get the selected data
        var selectedId = data.samples.filter(x => x.id === id);

        // Get the top 10 sample values
        var sample_values = selectedId.map(x => x.sample_values).sort(function (a, b) { return b - a });
        var top_values = sample_values.map(x => x.slice(0, 10));

        // Get the top ten IDs
        var otu_ids = selectedId.map(x => x.otu_ids).sort(function (a, b) { return b - a });
        var top_ids = otu_ids.map(x => x.slice(0, 10));

        // Get the top ten labels
        var otu_label = selectedId.map(x => x.otu_labels).sort(function (a, b) { return b - a });
        var top_labels = otu_label.map(x => x.slice(0, 10));

        drawBarChart(top_values, top_ids, top_labels);
        var metadataSamples = data.metadata.filter(x => x.id === +id)[0];
        drawMetaData(metadataSamples);

        drawBubble(otu_ids, sample_values, otu_label);

        



    });//end promise

}//end updatePlotly(id)

init();

function drawBarChart(xDraw, yDraw, labelDraw){

    var trace = {
        // x: top_values[0],
        x: xDraw[0],
        // y: top_ids[0].map(x => "OTU" + x),
        y: yDraw[0].map(x => "OTU" + x),

        // y: top_ids[0],
        text: labelDraw[0],
        type: 'bar',
        orientation: 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }],
        marker: {
            opacity: 0.5,
            line: {
                width: 2
            }
        }
    };

    // bar layout
    var barLayout = {
        title: "<b>Top 10 OTU</b>"
    };
    var barData = [trace];
    var config = { responsive: true }

    // draw bar chart
    Plotly.newPlot('bar', barData, barLayout, config);

}

function drawMetaData(metadataSamples){
    

    // Get the demographic information
    var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
    var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
    sampleMetadata.enter()
      .append('h1')
      .merge(sampleMetadata)
      .text(d => `${d.key} : ${d.value}`)
      .style('font-size', '50%')
}

function drawGauge(data){
    var metadataSamples = data.metadata.filter(x => x.id === +id)[0];
     // Get the wash frequency for the current ID            
     var wFreq = metadataSamples.wfreq;
     var wFreqDeg = wFreq * 20;
 
     // Calculations for gauge pointer
     var degrees = 180 - wFreqDeg;
     var radius = 0.5;
     var radians = (degrees * Math.PI) / 180;
     var x = radius * Math.cos(degrees * Math.PI / 180);
     var y = radius * Math.sin(degrees * Math.PI / 180);
 
     // Create path
     var path = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
     var mainPath = path,
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
     var path = mainPath.concat(pathX, space, pathY, pathEnd);
 
     // Create trace
     var dataGauge = [
       {
         type: "scatter",
         x: [0],
         y: [0],
         marker: { size: 12, color: "rgba(27,161,187,1)" },
         showlegend: false,
         name: "Freq",
         text: wFreq,
         hoverinfo: "text+name"
       },
       {
         values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
         rotation: 90,
         text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
         textinfo: "text",
         textposition: "inside",
         marker: {
           colors: [
             'rgba(27,161,187,0.7)',
             'rgba(54,170,191,0.6)',
             'rgba(80,178,194,0.6)',
             'rgba(107,187,198,0.5)',
             'rgba(134,196,201,0.5)',
             'rgba(160,204,205,0.4)',
             'rgba(187,213,208,0.4)',
             'rgba(213,221,212,0.3)',
             'rgba(240,230,215,0.3)',
             'rgba(225,225,225,0)',
 
           ]
         },
         labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
         hoverinfo: "label",
         hole: 0.5,
         type: "pie",
         showlegend: false
       }
     ];
 
     // Create the layout
     var layoutGauge = {
       shapes: [
         {
           type: "path",
           path: path,
           fillcolor: "rgba(27,161,187,1)",
           line: {
             color: "rgba(27,161,187,1)"
           }
         }
       ],
       title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
       height: 550,
       width: 550,
       xaxis: {
         zeroline: false,
         showticklabels: false,
         showgrid: false,
         range: [-1, 1]
       },
       yaxis: {
         zeroline: false,
         showticklabels: false,
         showgrid: false,
         range: [-1, 1]
       }
     };
     var config = { responsive: true }
 
     // Plot the gauge chart
     Plotly.newPlot('gauge', dataGauge, layoutGauge, config);
 
}
function drawBubble(otu_ids, sample_values, otu_label){

    // var test = data.samples.filter(x => x.id === id);

    var trace = {
        x: otu_ids[0],
        y: sample_values[0],
        text: otu_label[0],
        mode: 'markers',
        marker: {
          color: otu_ids[0],
          size: sample_values[0]
        }
      };
  
      // Create layout
      var layout = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
        autosize: true
      };
  
      // Draw the bubble chart
      var data = [trace];
      var config = { responsive: true }
      Plotly.newPlot('bubble', data, layout, config);
}