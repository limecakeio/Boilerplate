/**
* Handles all table processing for the CNC-Interface
* By ForkGitIT
*/

//Sorting variables
var clickCount = 0;
//Processing variables
let processingTasks = false;

//Define table names - includes the title and the id of the section that contains the table
var statusTableContainer = "status-table";
var taskTableContainer = "tasks-table";
var botsTableContainer = "bots-table";

//Define the headings for each section
var statusTableHeading = "Status Table [Bots]";
var tasksTableHeading = "Task Table [Bots]";
var botsTableHeading = "Report Table [Bots]";

//Define the sort state for relevant tables: type of data, key,
var statusTableSort = [statusTableContainer, "id", "number"];
var tasksTableSort = [taskTableContainer, "id", "number"];
var botsTableSort = [botsTableContainer, "id", "number"];

//Define the location of data sources - the url
var statusServer = "http://localhost:3000/api/Status";
var tasksServer = "http://localhost:3000/api/Tasks";
var botsServer = "http://localhost:3000/api/Reports";

//Define local copies
var statusData;
var taskData;
var botsData;

//Resets and composes an entire table {Currently limited to Status, Task and Bots tables only}
composeTable = function(dataSource, containerID){
  //Reset the section content
  var section = document.querySelector("#" + containerID);
  section.innerHTML="";

  //Setting the section heading
  let heading;
  if(containerID == "status-table") {
    heading = statusTableHeading;
  } else if (containerID == "tasks-table") {
    heading = tasksTableHeading;
  } else if (containerID == "bots-table") {
    heading = botsTableHeading;
  };
  var headline = document.createElement("h1");
  headline.innerHTML= heading;
  let currentSection = document.querySelector("#" + containerID);
  currentSection.appendChild(headline);

  //Retrieve a fresh copy of the table data
  fetch(dataSource).then((response) => {
    return response.json();
  }).then((json) => {

    if(json.length > 0) {
      //Sort and save local copy of the data
      if(containerID == "status-table") {
        statusData = sortData(json, statusTableSort);
      } else if(containerID == "tasks-table") {
        tasksData = sortData(json, tasksTableSort);
      } else if(containerID == "bots-table") {
        botsData = sortData(json, botsTableSort);
      };

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
          if(containerID == "bots-table") {
            var syncCell = document.createElement('TH');
            syncCell.innerHTML= "sync";
            tableHeaderRow.appendChild(syncCell);
          }
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
              if(containerID == "bots-table") {
                var syncValue = currentValue.sync;
                if(syncValue == null) {
                  syncValue = 0;
                };
                var tableCellSync = tableRow.insertCell();
                tableCellSync.innerHTML = syncValue;
              }
            } else {
              var tableCell = tableRow.insertCell();
              tableCell.innerHTML= currentValue;
            };
          };
        };
        newTable.appendChild(tableBody);

        //Add the table to the section
        var tableSection = document.querySelector("#" + containerID);
        tableSection.appendChild(newTable);

        //Set the correct sorting order
        var isEven = (clickCount % 2 == 0);
        var order;
        if(isEven) {
          order = "ascent";
        } else {
          order = "descent";
        };

        var allTableHeaders = document.querySelectorAll("th");

        for(var i = 0; i < allTableHeaders.length; i++) {
          if(allTableHeaders[i].getAttribute("data-ref") == "tasks-table") {
            if(allTableHeaders[i].getAttribute("data-field") == tasksTableSort[1]) {
              allTableHeaders[i].classList.add(order);
            }
          } else if(allTableHeaders[i].getAttribute("data-ref") == "status-table") {
            if (allTableHeaders[i].getAttribute("data-field") == statusTableSort[1]){
             allTableHeaders[i].classList.add(order);
           }
         } else if (allTableHeaders[i].getAttribute("data-ref") == "bots-table") {
             if (allTableHeaders[i].getAttribute("data-field") == botsTableSort[1]){
              allTableHeaders[i].classList.add(order);
            }
          };
        };
        //Special treatment for specific tables
        if(containerID === "status-table"){
          addActionButtons(containerID);
        };
    }

    //Special treatment for specific elements
    if (containerID === "tasks-table") {
      addTaskForm(containerID);
    } else if (containerID === "bots-table") {
      addProcessButton(containerID);
    };
  });
};


/**Adds a process-button to the current section.
* Requires the sectionID of the section the button is to be added to.
*/

let addProcessButton = function(sectionID) {
  let currentSection = document.querySelector("#" + sectionID);
  let btn = document.createElement("BUTTON");
  btn.classList.add("btn", "process-button");
  btn.setAttribute('onclick', 'toggleTaskProcessing()');
  if(!processingTasks) {
    btn.innerHTML = "Start Processing Tasks";
    btn.classList.add("btn-start");
  } else {
    btn.innerHTML = "Pause Processing Tasks";
    btn.classList.add("btn-stop");
  }
  currentSection.appendChild(btn);
}

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
    var btn = document.createElement('BUTTON');
    var id = currentCells[0].innerHTML; //The ID of the Bot
    btn.classList.add("btn");
    btn.setAttribute('onclick', 'toggleStatus(this)');
    btn.setAttribute('data-id', id);

    //We know we want to know what's in the 4th cell
    var newCell = document.createElement('TD');

    if(currentCells[3].innerHTML == "0"){
      btn.classList.add("btn-start");
      btn.innerHTML="Start";
    } else {
      btn.classList.add("btn-stop");
      btn.innerHTML="Stop";
    };

    newCell.appendChild(btn);
    currentRow.appendChild(newCell);
  };
};

/**
* Adds a new header-column to the end of a table.
* Requires the header row the column is to be added to.
* Required the title of the new column as a string.
*/
var addHeaderColumn = function(headerRow, columnTitle){
  var newColumn = document.createElement('TH');
  newColumn.innerHTML=columnTitle;
  headerRow.appendChild(newColumn);
};
