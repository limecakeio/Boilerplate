/**
* Handles all table processing for the CNC-Interface
* By ForkGitIT
*/

//Sorting variables - required primarily when composing tables
var clickCount = 0;

//Creates and updates BOT-Report table
let composeTable = function(obj) {
  //Set the table heading
  const targetSection = document.querySelector("#" + obj.section);
  targetSection.innerHTML=" "; //Reset the section for every call
  const table = document.createElement("TABLE");
  const tableHeader = document.createElement("THEAD");
  const tableBody = document.createElement("TBODY");

  //Set up the section's title
  let sectionTitle = document.createElement("H1");
  sectionTitle.innerHTML = obj.title;
  targetSection.appendChild(sectionTitle);

  //Set's an object's value keys as table headers
  //Is able to go down into one sub-object
  const populateHeaders = function(elem){
    let headings = Object.keys(elem);
    headings.forEach(heading => {
      if(typeof elem[heading] === "object") {
        let subHeadings = Object.keys(elem[heading]);
        subHeadings.forEach(subHeading => {
          let tableHeading = document.createElement("TH");
          tableHeading.innerHTML = subHeading;
          tableHeader.appendChild(tableHeading);
        });
      } else {
        let tableHeading = document.createElement("TH");
        if(heading == "ip") {
          tableHeading.setAttribute("data-type", "ip");
        } else {
          tableHeading.setAttribute("data-type", typeof elem[heading]);
        }
        tableHeading.setAttribute("data-field", heading);
        tableHeading.setAttribute("data-ref", obj.section);
        tableHeading.setAttribute("onclick", "sortBy(this)");
        tableHeading.id = obj.section + "-" + heading;
        tableHeading.innerHTML = heading;
        tableHeader.appendChild(tableHeading);
      }
    })
  };

  if(obj.data.length > 0) {
    populateHeaders(obj.data[0]);
  }

  const populateCells = function(data) {
    data.forEach(elem => {
      let keys = Object.keys(elem);
      let tableRow = document.createElement("TR");
      keys.forEach(key => {
        if(typeof elem[key] === "object") {
          let subKeys = Object.keys(elem[key]);
          subKeys.forEach(subKey => {
            let cell = document.createElement("TD");
            cell.innerHTML = elem[key][subKey];
            tableRow.appendChild(cell);
          });
        } else {
        let cell = document.createElement("TD");
        cell.innerHTML= elem[key];
        tableRow.appendChild(cell);
      };
    });
    tableBody.appendChild(tableRow);
  });
}

if(obj.data.length > 0) {
  populateCells(obj.data);
}


//Set the correct sorting order
let isEven = (clickCount % 2 == 0);
let order;
if(isEven) {
  order = "ascent";
} else {
  order = "descent";
}

//Add the order to the correct column's class list
let sectionTableHeaders = Array.prototype.slice.call(tableHeader.querySelectorAll("th[data-ref=\"" + obj.section + "\"]"));
let sortedColumn = sectionTableHeaders.find(tHead => {
  return tHead.getAttribute("data-field") === obj.sort.column;
});
if(typeof sortedColumn !== "undefined") {
  sortedColumn.classList.add(order);
}

table.appendChild(tableHeader);
table.appendChild(tableBody);
targetSection.appendChild(table);

//Special treatment for specific sections
if (obj.section === "tasks-table") {
  addTaskForm(obj.section);
} else if (obj.section === "status-table") {
  addActionButtons(obj.section);
}
};

/**Adds a column to a table with action buttons.
*  Requires the sectionID of the section the table is hosted in.
*/
var addActionButtons = function(section) {
  let tableHeaderRow = document.querySelector("#" + section + " table thead");
  let buttonColumn = document.createElement("TH");
  tableHeaderRow.appendChild(buttonColumn);

  //Create new cells for each row based on workload-status
  let tableBodyRows = Array.prototype.slice.call(document.querySelectorAll("#" + section + " table tbody tr"));
  tableBodyRows.map(row => {
    let currentCells = row.cells;
    let id = currentCells[0].innerHTML; //The ID of the Bot
    let btn = document.createElement('BUTTON');
    btn.classList.add("btn");
    btn.setAttribute('onclick', 'toggleStatus(this)');
    btn.setAttribute('data-id', id);

    var newCell = document.createElement('TD');
    //We know the bot-status is in the 4th cell
    if(currentCells[3].innerHTML == "0"){
      btn.classList.add("btn-start");
      btn.innerHTML="Start";
    } else {
      btn.classList.add("btn-stop");
      btn.innerHTML="Stop";
    };

    newCell.appendChild(btn);
    row.appendChild(newCell);
  });
};
