/**
* GLOBAL TABLE HEADER VARS
*
*/

var statusJSON;
var tasksJSON;

var stIdStatus = ["st-id", 0, true]; //Table is initially sorted by ID
var stIpStatus = ["st-ip", 0, false];
var stTaskStatus = ["st-task", 0, false];
var stWorkloadStatus = ["st-workload", 0, false];

var stHeaders = [stIdStatus, stIpStatus, stTaskStatus, stWorkloadStatus];

/**
* Fetch the current JSON object from the botnet server. Requires the final
* directory of the URL passed on as a string.
*/
fetchJSON = function(target) {
  fetch('http://botnet.artificial.engineering:80/api/' + target).then((response) => {
    return response.json();
  }).then((json) => {
    var i = 0;

    if(target == "Status"){
      statusJSON = json;
      //Get the active sorting header
      while(stHeaders[i][2] == false) {
        i++;
      }
    } else {
      tasksJSON = json;
    }
    jsonSort(i);
  });
};

/**
*Toggles the active/non-active button
*/
toggleBtn = function(obj) {
  if(obj.textContent === 'Start'){
    obj.textContent = 'Stop';
    obj.style.background = '#f25f5c';
  }
  else{
    obj.textContent = 'Start';
    obj.style.background = '#aafcb8';
  }
}

/*
**/
populateTable = function(json) {

  var tableBody = document.getElementById('status-table-body');
  tableBody.innerHTML="";

  //Insert the values from the current JSON file into the table
  for(var i = 0; i < json.length; i++) {
    var row = tableBody.insertRow(i);
    for(var j = 0; j < Object.keys(json[0]).length; j++) {
      var cell = row.insertCell(j);
      var currentKey = Object.keys(json[i])[j];
      var currentValue = json[i][currentKey];
      cell.innerHTML = currentValue;
    }

    //Add the action button to the final cell
    var cell = row.insertCell(json.length);
    cell.innerHTML = '<button class="btn btn-start" onclick="toggleBtn(this)">Start</button>';
  }
}
var sortBy = function(tHead){
  //Set all headers to false
  for(var i = 0; i < stHeaders.length; i++) {
    if(tHead.id == stHeaders[i][0]) {
      console.log("Sorting column " +i);
      stHeaders[i][1]++; //Increase the click count
      if(stHeaders[i][1] % 2 == 0) {
        tHead.classList.add("ascent");
        tHead.classList.remove("descent");
      } else {
        tHead.classList.add("descent");
        tHead.classList.remove("ascent");
      }
      stHeaders[i][2] = true; //Set as active
      jsonSort(i);
    } else {
      stHeaders[i][2] = false; //Set others as inactive
      document.getElementById(stHeaders[i][0]).classList.remove("ascent", "descent");
    }
  }
}
