
// build the dropdown
function dropdownmenu() {
  d3.json("samples.json").then(function (data) {
    var samplename = data.names;
    console.log(samplename)
    var menu = d3.select("#selDataset")
    samplename.forEach((index) => {
      menu.append("option").text(index).property('value')
    })
    buildPlot(samplename[0])
    buildBubble(samplename[0])
    buildtable(samplename[0])
    buildGauge(samplename[0])
  })
};


// build the table on demographics
function buildtable(sampleid) {
  d3.json("samples.json").then(function (data) {
    var samplename = data.names;
    // x represents the index of selected id, needed to get the data for table
    var x = samplename.indexOf(sampleid)
     
    //get the variables for the table
    var tableinfo_id = 'id: ' + (data.metadata[x].id);
    var tableinfo_ethnicity = 'ethnicity: ' + (data.metadata[x].ethnicity);
    var tableinfo_gender = 'gender: ' + (data.metadata[x].gender);
    var tableinfo_age = 'age: ' + (data.metadata[x].age);
    var tableinfo_location = 'location: ' + (data.metadata[x].location);
    var tableinfo_bbtype = 'bbtype: ' + (data.metadata[x].bbtype);
    var tableinfo_wfreq = 'wfreq: ' + (data.metadata[x].wfreq);

    //console.log(tableinfo_id, tableinfo_ethnicity, tableinfo_gender, tableinfo_age, tableinfo_location, tableinfo_bbtype, tableinfo_wfreq)
    //publish the variables on the html page
    var tableloc = d3.select(".panel-body")
    tableloc.html("")
    var trow
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_id);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_ethnicity);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_gender);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_age);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_location);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_bbtype);
    trow = tableloc.append("tr");
    trow.append("td").text(tableinfo_wfreq);
  })
};

// refresh the data when a new Id is selected
function optionChanged(sampleid) {
  buildPlot(sampleid)
  buildBubble(sampleid)
  buildtable(sampleid)
  buildGauge(sampleid)
}
dropdownmenu()

// build the bar chart
function buildPlot(sampleid) {
  d3.json("samples.json").then(function (data) {
    var filterdata = data.samples.filter(x => x.id == sampleid)
    var result = filterdata[0]
    var otuids = result.otu_ids
    var values = result.sample_values

    //create the traces
    var trace1 = {
      x: values.slice(0, 10).reverse(),
      y: otuids.slice(0, 10).map(x => `OTU ${x}`).reverse(),
      type: "bar",
      orientation: "h"
    };
    // data to be ploted
    var data = [trace1];

    // define the layout
    var layout = {
      title: "Top 10 OTUs found in the selected individual",
      xaxis: { title: "Amount" },
    };
    //plot the horizontal bar chart
    Plotly.newPlot("bar", data, layout);
  })
}

// build the bubble chart
function buildBubble(sampleid) {
  d3.json("samples.json").then(function (data) {
    var filterdata = data.samples.filter(x => x.id == sampleid)
    var result = filterdata[0]
    var otuids = result.otu_ids
    var values = result.sample_values
    var labels = result.otu_labels

    //create the traces
    var trace1 = {
      y: values,
      x: otuids,
      text: labels,
      mode: 'markers',
      marker: {
        color: otuids,
        colorscale: 'Earth',
        size: values,
      }
    };

    // data to be ploted
    var data = [trace1];

    // define the layout
    var layout = {
      title: "All OTUs found in the selected individual",
      xaxis: { title: "OTU#" },
    };
    //plot the bubble chart
    Plotly.newPlot("bubble", data, layout);
  })
}

//build gauge chart
function buildGauge(sampleid) {
  d3.json("samples.json").then(function (data) {
    var filterdata = data.metadata.filter(x => x.id == sampleid)
    var result = filterdata[0]
    var wfreq = (result.wfreq);
    console.log(wfreq)

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week" },
        type: "indicator",
        mode: "gauge+number",
        // color:"red",
        gauge: {
          axis: { range: [null, 9] },
          bar:{color:"rgba(0, 140, 150, 1)"},
          steps: [
            { range: [0, 1], color: 'rgba(0, 120, 0, .2)' },
            { range: [1, 2], color: 'rgba(0, 120, 0, .3)' },
            { range: [2, 3], color: 'rgba(0, 120, 0, .4)'},
            { range: [3, 4], color: 'rgba(0, 120, 0, .5)' },
            { range: [4, 5], color: 'rgba(0, 120, 0, .6)' },
            { range: [5, 6], color: 'rgba(0, 120, 0, .7)' },
            { range: [6, 7], color: 'rgba(0, 120, 0, .8)' },
            { range: [7, 8], color: 'rgba(0, 120, 0, .9)' },
            { range: [8, 9], color: 'rgba(0, 120, 0, 1)' },
          ],

        }
      }];
    var layout = { 
      width: 500, 
      height: 450, 
      margin: { t: 0, b: 0 }, 
      };
    Plotly.newPlot('gauge', data, layout);
  })
};

buildPlot();
buildBubble();
buildGauge();


