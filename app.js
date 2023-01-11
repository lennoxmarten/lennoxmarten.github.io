

var dienstleisterSwitchChecked = true; 
var wawiSwitchChecked = true; 
var shopsystemeSwitchChecked = true; 
var _JsonData;
var filtered_JsonData;
var bubbleSize = 30;



  

// read Excel file and convert to json format using fetch
//Search for service provider 
// read Excel file and convert to json format using fetch
fetch('VISO_Daten.xlsx').then(function (res) {
  /* get the data as a Blob */
  if (!res.ok) throw new Error("fetch failed");
  return res.arrayBuffer();
})
.then(function (ab) {
  /* parse the data when it is received */
  var data = new Uint8Array(ab);
  var workbook = XLSX.read(data, {
      type: "array"
  });
  

  /* *****************************************************************
  * DO SOMETHING WITH workbook: Converting Excel value to Json       *
  ********************************************************************/
  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
  
 _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });



  
  /************************ End of conversion ************************/


  _JsonData.forEach(obj => {
    obj.Shopsysteme = obj.Shopsysteme.split(',');
    obj.WaWis = obj.WaWis.split(',');
    obj.Dienstleister = obj.Dienstleister.split(',');
   
  });
  
  _JsonData.reduce((prev, servprov, index) => {
    servprov.text = servprov.Firmenname;
    servprov.id = index;
    servprov.x = 800;
    servprov.y = 250;
    return servprov;
  }, {});
  console.log("This is the JSON data:" ,_JsonData);


  filtered_JsonData = [{}]

 

  const links = [];
  
  

  
  

  for (let x in _JsonData) {
    if(_JsonData[x].Firmenname == "" || _JsonData[x].Status == "Backlog" || _JsonData[x].Status == "In Vorbereitung" || _JsonData[x].Status == "Vorvertraglich / Ausstehend" ){
      delete _JsonData[x];
      
    }




   
  }

 
_JsonData = _JsonData.filter(function(x) { return x !== null });

console.log("This is the unfiltered JSON: ", _JsonData);

console.log(_JsonData);

console.log("THIS IS THE JSON YOU HAVE TO USE:\n", JSON.stringify(_JsonData));
for (let x in _JsonData){
    
  if(_JsonData[x].Service == "Dienstleister" || _JsonData[x].Service == "Shopsystem" || _JsonData[x].Service == "Warenwirtschaft" || _JsonData[x].Service == "Servicelösung"){
    filtered_JsonData.push(_JsonData[x]);
  }
} 
filtered_JsonData.splice(0, 1);

console.log(filtered_JsonData)

filtered_JsonData.forEach(node => {
  let targets;
  if (Array.isArray(node.Shopsysteme)) {
    targets = filtered_JsonData.filter(n => node.Shopsysteme.includes(n.Firmenname));
  } else {
    targets = filtered_JsonData.filter(n => n.Shopsysteme === node.Firmenname);
  }
  targets.forEach(target => {
    links.push({ source: node, target });
  });
});

filtered_JsonData.forEach(node => {
  let targets;
  if (Array.isArray(node.WaWis)) {
    targets = filtered_JsonData.filter(n => node.WaWis.includes(n.Firmenname));
  } else {
    targets = filtered_JsonData.filter(n => n.WaWis === node.Firmenname);
  }
  targets.forEach(target => {
    links.push({ source: node, target });
  });
});

filtered_JsonData.forEach(node => {
  let targets;
  if (Array.isArray(node.Dienstleister)) {
    targets = filtered_JsonData.filter(n => node.Dienstleister.includes(n.Firmenname));
  } else {
    targets = filtered_JsonData.filter(n => n.Dienstleister === node.Firmenname);
  }
  targets.forEach(target => {
    links.push({ source: node, target });
  });
});

console.log(links)


console.log("This is the filtered JSON: ", filtered_JsonData);




$(".prompt").select2({
  data: _JsonData,
  width: '15vw',
  height: "100px",
  
  multiple: true,
  placeholder: "Search for connections",
  theme: "classic",
  dropdownCssClass: "custom-dropdown", 

});









  
   const width = window.innerWidth;
   const height = window.innerHeight;
 
   // location to centre the bubbles
   const centreX = document.getElementById("vis").offsetWidth / 2;
   console.log("This is the centreX: ", centreX)
   
   const centreY = document.getElementById("vis").offsetHeight / 2;
   console.log("This is the centreY: ", centreY)
   const centre = { x: centreX, y: centreY };
 
   // strength to apply to the position forces
   const forceStrength = 0.03;
 
   // these will be set in createNodes and chart functions
   let svg = null;
   let bubbles = null;

   let nodes = [];

  

   


 
   // charge is dependent on size of the bubble, so bigger towards the middle
   function charge(d) {
     return Math.pow(d.radius, 2.0) * 0.0175
   }
 
  
   // create a force simulation and add forces to it
   var simulation = d3.forceSimulation(filtered_JsonData)
     .force('charge', d3.forceManyBody().strength(charge))
      
     // .force('center', d3.forceCenter(centre.x, centre.y))
     .force('x', d3.forceX().strength(forceStrength).x(centre.x))
     .force('y', d3.forceY().strength(forceStrength).y(centre.y))
     .force('collision', d3.forceCollide().radius(bubbleSize + 3));
     
 
     
 
   // force simulation starts up automatically, which we don't want as there aren't any nodes yet
   
 
   
 
   // data manipulation function takes raw data from csv and converts it into an array of node objects
   // each node will store data and visualisation values to draw a bubble
   // rawData is expected to be an array of data objects, read in d3.csv
   // function returns the new node array, with a node for each element in the rawData input
   
 
   // main entry point to bubble chart, returned by parent closure
   // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process

    
     // convert raw data into nodes data
     
     // create svg element inside provided selector
     svg = d3.select("#vis")
       .append("svg")
       .attr("height", "98%")
       .attr("width", "98%")
       
       
    


       const fillColour = d3.scaleOrdinal()
          .domain(["Dienstleister", "Warenwirtschaft", "Shopsystem",])
          .range(["#cb2424", "#3d85c6", "#83d429"])

       console.log(links);

       var node = svg.selectAll("circle")
          .data(filtered_JsonData)

          .enter().append("circle")
          .attr("r", bubbleSize)
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("fill", d => fillColour(d.Service))
          .attr("id", d => d.id)
          .attr("Firmenname", d => d.Firmenname)
          

          const text = svg.selectAll('text')
          .data(filtered_JsonData)
          .enter()
          .append('text');
     
          text.text(d => d.Firmenname)
     
          text.attr('x', d => d.x)
          .attr("Firmenname", d => d.Service)
          .attr('y', d => d.y)
          .attr("id", d => d.id)
     
          text.style('font-size', '12px')
              .style('font-family', 'sans-serif')
              .style("text-anchor", "middle")
          
       
    
 console.log(height - document.getElementById("navbar").clientHeight- 5);
      var totalDisplaySize = window.innerWidth * window.innerHeight;
      console.log("This is the window height: ", window.innerHeight);
      console.log("This is the window width: ", window.innerWidth);
      console.log("This is the total display size: ", totalDisplaySize);
      var scaleFactor = totalDisplaySize * 0.000001;
      console.log("This is the scale factor: ", scaleFactor);
      
 
      d3.select("svg")
        .transition()
        

        
 
 
 


       
       
       


   
 console.log(_JsonData)

 $(".prompt").on("select2:select", function (e){
  
 
  var select2OBJ = $('.prompt').select2('data');
 
  console.log(JSON.stringify($('.prompt').select2('data')))


  for (let i = 0; i < select2OBJ.length; i++) {
    console.log(select2OBJ[i]["Firmenname"])
    var selectedBubble = 
       d3.selectAll(node)
                             .filter(
                             
                              
                              function(d) { 
                                try {
                                  
                                   return d.Firmenname == select2OBJ[i]["Firmenname"];    // Filter by label 
                                   
                                   


                                }
                                catch {
                                  console.log("Catch 1 entered");
                                  

                                }
                              })
                               // .datum();
    selectedBubble
    .style("opacity", 1)

    console.log(selectedBubble["_groups"][0][0].id);
    console.log(JSON.stringify(selectedBubble));
 
                             
      

    
  

    
    
    

    d3.selectAll("line").style("display", "none")

    //Change the opacity of all non-connected nodes
    const selectedNode = selectedBubble.data()[0];
    d3.selectAll("circle")
        .filter(function(d) {
    // Check if the node is not connected to the selected node
    return !links.some(link => link.source === d && link.target === selectedNode) &&
           !links.some(link => link.source === selectedNode && link.target === d);
  })
  .style("opacity", 0.1);
  selectedBubble.style("opacity", 1)


      
    console.log("clicked")
    
      d3.selectAll("line").filter(link => link.source.id == selectedBubble["_groups"][0][0].id || link.target.id == selectedBubble["_groups"][0][0].id).style("display", "block")
 
 // Select all circles that are connected to the selected node
d3.selectAll("circle")
.filter(function(d) {
  return links.some(link => link.source === d && link.target === selectedNode) ||
         links.some(link => link.source === selectedNode && link.target === d);
})
.raise();  // Raise these circles above the other circles in the DOM
selectedBubble.raise();
d3.selectAll("text").raise()
visibility = true;
console.log("The visibility is set to: ", visibility);

};

 
  
})

$(".prompt").on("select2:unselect", function (e){
  console.log("[SECOND CLICK] Node is already selected");
  d3.selectAll("circle").style("opacity", 1)
  d3.selectAll("line").style("display", "none")

  // Unselect the node
  d3.select(this).style("stroke", "none");

  // Set visibility to false
  visibility = false; 
  console.log("The visibility is set to: ", visibility);  

  

 


})



       var visibility = false;



       var link = svg.selectAll("line")
       .data(links)
       .enter().append("line")
       .attr("stroke", "grey")
       .attr("stroke-width", 3)
       .style("display", "none")
       .attr("x1",d => d.source.x )
        .attr("y1",d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
       
      

        
 
  node.on("click", function(event,d) {
    

    const selectedNode = d3.select(this).data()[0];

// Select all of the circles and filter them to only include those that are connected to the selected node
var notConnectedNodes = d3.selectAll("circle")
  .filter(function(d) {
    // Check if the node is connected to the selected node
    return links.some(link => link.source === d && link.target === selectedNode) ||
           links.some(link => link.source === selectedNode && link.target === d);
  });
  notConnectedNodes.data().forEach(data => {
    console.log(data.Firmenname);
    console.log(typeof(data.Firmenname))
      
  }
  );
  const firmenNames = notConnectedNodes.data().map(data => data.Firmenname);

// Join the array of names into a single string, separated by commas
const firmenNamesString = firmenNames.join(", <br />");
    
  
    document.getElementById("sideBar-Connections").innerHTML = "<h3>Angewählt: </h3>" + this.__data__.Firmenname +"("+ this.__data__.Service +")"+ "<br />" + "<h3>Verbindungen: </h3>" + firmenNamesString
    document.getElementById("textArea0").innerHTML = "Lieber Partner, &#13;&#10;vielen Dank für Ihre Nachricht! &#13;&#10;" + this.__data__.Firmenname + " ist ein/e " + this.__data__.Service + " und hat Verbindungen zu: &#13;&#10; " + firmenNamesString
    console.log(this.__data__.Firmenname)
    console.log("[FIRST CLICK]")

    if(!visibility){
  

    d3.select(this)
    .style("stroke-width", 2)
    .style("stroke-opacity", 0.5)
    .style("stroke", "black");
    
    

    d3.selectAll("line").style("display", "none")

    //Change the opacity of all non-connected nodes
    
    d3.selectAll("circle")
        .filter(function(d) {
    // Check if the node is not connected to the selected node
    return !links.some(link => link.source === d && link.target === selectedNode) &&
           !links.some(link => link.source === selectedNode && link.target === d);
  })
  .style("opacity", 0.2);
  d3.select(this).style("opacity", 1)


      console.log(d.id);
    console.log("clicked")
    console.log(this.__data__.id);
      d3.selectAll("line").filter(link => link.source.id === this.__data__.id || link.target.id === this.__data__.id).style("display", "block")
 
 // Select all circles that are connected to the selected node
d3.selectAll("circle")
.filter(function(d) {
  return links.some(link => link.source === d && link.target === selectedNode) ||
         links.some(link => link.source === selectedNode && link.target === d);
})
.raise();  // Raise these circles above the other circles in the DOM
d3.selectAll("text").raise()
visibility = true;
console.log("The visibility is set to: ", visibility);

    } else {
      document.getElementById("sideBar-Connections").innerHTML = "";
        // Node is already selected
    console.log("[SECOND CLICK] Node is already selected");
    d3.selectAll("circle").style("opacity", 1)
          d3.selectAll("line").style("display", "none")

    // Unselect the node
    d3.select(this).style("stroke", "none");

    // Set visibility to false
    visibility = false; 
    console.log("The visibility is set to: ", visibility);  

    }
  
    


     })
 
 
 
   
 node.on("dbl")   

 
 node.on('mouseover', function(event,d) {
  d3.select(this)
    .style("stroke-width", 2)
    .style("stroke-opacity", 0.5)
    .style("stroke", "black");

  d3.select(this).raise();
  text.raise();
});

node.on('mouseout', function(event,d) {
  d3.select(this)
    .style("stroke", "none");
});
 

 
 
 


   

     simulation.on('tick', () => {

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
            
       
            link.attr("x1",d => d.source.x )
            .attr("y1",d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

            text.attr('x', d => d.x)
            .attr('y', d => d.y);
            
            });
            var myObject = {
              dienstleisterSwitch: function(node) {

                if(dienstleisterSwitchChecked == true){
                  console.log("It's false now!")
                  dienstleisterSwitchChecked = false;
                  console.log(filtered_JsonData.length)
                  console.log(node)
                  var dienstleisterNodes = node.filter(function(d) {
                    return d.Service == "Dienstleister";});
                    
                  dienstleisterNodes.style("display", "none")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Dienstleister";});
                    
                  textNodes.style("display", "none")
                    
                  

           
                  

                } else {

                  console.log("It's true now!")
                  dienstleisterSwitchChecked = true;
                  var dienstleisterNodes = node.filter(function(d) {
                    return d.Service == "Dienstleister";});
                    
                  dienstleisterNodes.style("display", "block")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Dienstleister";});
                    
                  textNodes.style("display", "block")

                }
              }
            };

            var myObject1 = {
              wawisSwitch: function(node) {

                if(wawiSwitchChecked == true){
                  console.log("It's false now!")
                  wawiSwitchChecked = false;
                  console.log(filtered_JsonData.length)
                  console.log(node)
                  var wawiNodes = node.filter(function(d) {
                    return d.Service == "Warenwirtschaft";});
                    
                  wawiNodes.style("display", "none")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Warenwirtschaft";});
                    
                  textNodes.style("display", "none")
                    

                } else {

                  console.log("It's true now!")
                  wawiSwitchChecked = true;
                  var wawiNodes = node.filter(function(d) {
                    return d.Service == "Warenwirtschaft";});
                    
                  wawiNodes.style("display", "block")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Warenwirtschaft";});
                    
                  textNodes.style("display", "block")

                }
              }
            };

            var myObject2 = {
              shopsystemeSwitch: function(node) {
                
                if(shopsystemeSwitchChecked == true){
                  console.log("It's false now!")
                  shopsystemeSwitchChecked = false;
                  console.log(filtered_JsonData.length)
                  console.log(node)
                  var shopNodes = node.filter(function(d) {
                    return d.Service == "Shopsystem";});
                    
                  shopNodes.style("display", "none")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Shopsystem";});
                    
                  textNodes.style("display", "none")
                    

                } else {

                  console.log("It's true now!")
                  shopsystemeSwitchChecked = true;
                  var shopNodes = node.filter(function(d) {
                    return d.Service == "Shopsystem";});
                    
                  shopNodes.style("display", "block")
                  var textNodes = text.filter(function(d) {
                    return d.Service == "Shopsystem";});
                    
                  textNodes.style("display", "block")

                }
              }
            };
            
            // Attach the dienstleisterSwitch function to the global object (e.g. window)
            window.dienstleisterSwitch = myObject.dienstleisterSwitch;
            window.wawisSwitch = myObject1.wawisSwitch;
            window.shopsystemeSwitch = myObject2.shopsystemeSwitch;
            
            // Call the dienstleisterSwitch function when the HTML button is clicked
            document.getElementById("checkboxDL").onclick = function() {
              dienstleisterSwitch(node);
            };

            document.getElementById("checkboxWaWi").onclick = function() {
              wawisSwitch(node);
            };

            document.getElementById("checkboxShop").onclick = function() {
              shopsystemeSwitch(node);
            };

})

