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
        var sorted_test = sample_values.sort(function (a, b) { return b - a });
        var top_ten = sorted_test.map(x => x.slice(0, 10));

        var sorted_ids = otu_ids.sort(function (a, b) { return b - a });
        var top_ids = sorted_ids.map(x => x.slice(0, 10));
        var sorted_labels = otu_label.sort(function (a, b) { return b - a });
        var top_labels = sorted_labels.map(x => x.slice(0, 10));

        // bar chart
        var trace1 = {
            x: top_ten[0],
            y: top_ids[0].map(x => "OTU" + x),
            text: top_labels[0],
            type: 'bar',
            orientation: 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending',
            }],
            marker: {
                opacity: 0.5,
                line: {
                    width: 2
                }
            }
        };
        // bar layout
        var layout1 = {
            title: '<b>Top 10 OTU</b>',
        };

        // draw bar chart
        var traceData = [trace1];
        var config = { responsive: true }
        Plotly.newPlot('bar', traceData, layout1, config);

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

        var trace = {
            x: top_values[0],
            y: top_ids[0].map(x => "OTU" + x),
            // y: top_ids[0],
            text: top_labels[0],
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

    });//end promise

}//end updatePlotly(id)

init();