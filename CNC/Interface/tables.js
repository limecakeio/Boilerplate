/**
* Handles all table processing for the CNC-Interface
*/

//Sorting variables
var clickCount = 0;

//Define table names - includes the title and the id of the section that contains the table
var statusTableContainer = "status-table";
var taskTableContainer = "tasks-table";

//Define the headings for each section
var statusTableHeading = "Status Table [Bots]";
var tasksTableHeading = "Task Table [Bots]";

//Define the sort state for relevant tables: type of data, key,
var statusTableSort = [statusTableContainer, "id", "number"];
var tasksTableSort = [taskTableContainer, "id", "number"];

//Define the location of data sources - the url
var statusServer = "http://botnet.artificial.engineering:80/api/Status";
var tasksServer = "http://botnet.artificial.engineering:80/api/Tasks";

//Define local copies
var statusData;
var taskData;

//Compose the tables
composeTable = function(dataSource, containerID){

  fetch(dataSource).then((response) => {
    return response.json();
  }).then((json) => {

    //Ensure the relevant section is cleared, then sort and save local copy of the data
    var heading;
    var section = document.querySelector("#" + containerID);
    section.innerHTML="";
    if(containerID == "status-table") {
      statusData = sortData(json, statusTableSort);
      heading = statusTableHeading;
    } else if(containerID == "tasks-table") {
      tasksData = sortData(json, tasksTableSort);
      heading = tasksTableHeading;
    };

    //Set the heading
    var headline = document.createElement("h1");
    headline.innerHTML= heading;

    //Create the table
    var newTable = document.createElement('TABLE');
    newTable.id= containerID + "-table";

    //Populate the header
    var tableHeader = newTable.createTHead();
    var tableHeaderRow = tableHeader.insertRow();
    var headings = Object.keys(json[0]);

    for(var i = 0; i < headings.length; i++) {
      var headerCell = document.createElement('TH');
      var dataType = typeof json[0][headings[i]];
      if(headings[i] == "ip") {
        headerCell.setAttribute("data-type", "ip");
      } else {
        headerCell.setAttribute("data-type", dataType);
      };
      headerCell.setAttribute("data-field", headings[i]);
      headerCell.setAttribute("data-ref", containerID);
      headerCell.setAttribute("onclick", "sortBy(this)");


      //Dirty fix for handling tasks containing a further level of data.
      if(headings[i] == "data") {
        var inputCell = document.createElement('TH');
        inputCell.innerHTML= "input";
        var outputCell = document.createElement('TH');
        outputCell.innerHTML= "output";
        tableHeaderRow.appendChild(inputCell);
        tableHeaderRow.appendChild(outputCell);
      } else {
        headerCell.id= containerID + "-" + headings[i];
        headerCell.innerHTML=headings[i];
        tableHeaderRow.appendChild(headerCell);
      };
    };

    //Populate the table body
    var tableBody = document.createElement('TBODY');
    for(var i = 0; i < json.length; i++) {
      var tableRow = tableBody.insertRow();
      for(var j = 0; j < headings.length; j++){
        var currentKey = Object.keys(json[i])[j];
        var currentValue = json[i][currentKey];

        //Dirty fix for dealing with objects while populating
        if(typeof currentValue == "object"){
          var inputValue = currentValue.input;
          if(inputValue == null) {
            inputValue = 0;
          };
          var outputValue = currentValue.output;
          if(outputValue == null) {
            outputValue = 0;
          };
          var tableCellInput = tableRow.insertCell();
          var tableCellOutput = tableRow.insertCell();
          tableCellInput.innerHTML = inputValue;
          tableCellOutput.innerHTML = outputValue;
        } else {
          var tableCell = tableRow.insertCell();
          tableCell.innerHTML= currentValue;
        };
      };
    };
    newTable.appendChild(tableBody);

    //Add the table to the section
    var tableSection = document.querySelector("#" + containerID);
    tableSection.appendChild(headline);
    tableSection.appendChild(newTable);

    //Set the correct sorting order
    var isEven = (clickCount % 2 == 0);
    var order;
    if(isEven) {
      order = "ascent";
    } else {
      order = "descent";
    }
    var allTableHeaders = document.querySelectorAll("th");
    for(var i = 0; i < allTableHeaders.length; i++) {
      if(allTableHeaders[i].getAttribute("data-ref") == "tasks-table") {
        if(allTableHeaders[i].getAttribute("data-field") == tasksTableSort[1]) {
          allTableHeaders[i].classList.add(order);
        };
      } else if(allTableHeaders[i].getAttribute("data-ref") == "status-table") {
        if (allTableHeaders[i].getAttribute("data-field") == statusTableSort[1]){
         allTableHeaders[i].classList.add(order);
       };
      };
    };

    //Special treatment for specific tables
    if(containerID == "status-table"){
      addActionButtons(containerID);
    };
  });
};

/**Adds a column to a table with action buttons.
*  Requires the sectionID of the section the table is hosted in.
*/
var addActionButtons = function(sectionID) {

  var tableHeaderRow = document.querySelector("#" + sectionID + " table thead tr");
  addHeaderColumn(tableHeaderRow, "action");


  //Create new cells for each row based on workload-status
  var tableBodyRows = document.querySelectorAll("#" + sectionID + " table tbody tr");
  for(var i = 0; i < tableBodyRows.length; i++){
    var currentRow = tableBodyRows[i];
    var currentCells = currentRow.cells;
    //We know we want to know what's in the 4th cell
    var newCell = document.createElement('TD');
    if(currentCells[3].innerHTML == "0"){
      newCell.innerHTML = "<button class='btn btn-start' onclick='toggleBtn(this)'>Start</button>";
    } else {
      newCell.innerHTML = "<button class='btn btn-stop' onclick='toggleBtn(this)'>Stop</button>";
    };
    //var id = document.createAttribute("data-id");
    //id.value = currentCells[0].innerHTML;
    //newCell.setAttributeNode(id);
console.log(currentCells[0].innerHTML);
console.log(typeof currentCells[0].innerHTML);
var inner = newCell.innerHTML;
    newCell.setAttribute("data-id", currentCells[0].innerHTML);
    currentRow.appendChild(newCell);
  };
};

/**
* Adds a header-column to the end of a table.
* Requires the header row the column is to be added to.
* Required the title of the new column as a string.
*/
var addHeaderColumn = function(headerRow, columnTitle){
  var newColumn = document.createElement('TH');
  newColumn.innerHTML=columnTitle;
  headerRow.appendChild(newColumn);
};
//Inititate the status table
composeTable(statusServer, statusTableContainer);

//Inititate the task table
composeTable(tasksServer, taskTableContainer);

