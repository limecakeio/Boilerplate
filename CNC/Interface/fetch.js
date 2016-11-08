fetchJSON = function() {
  fetch('http://botnet.artificial.engineering:80/api/Status').then((response) => {
    return response.json();
  }).then((json) => {
    currentJSON = json;
    populateTable(currentJSON);
    //json.sort(function(a, b){return a.id - b.id});
    // json.sort(function(a, b){
    //   return ipToValue(b.ip) - ipToValue(a.ip)
    // });
    // populateTable(json);
    // for(var i = 0; i < currentJSON.length; i++) {
    //   ipToValue(currentJSON[i].ip);
    // }
});
};

//Kicking off the joy
fetchJSON();

//Keep the joy going
setInterval(function() {
  fetchJSON();
}, 1000);

var currentJSON;

doFetch = function() {
  var img = document.querySelector('#status img');

  fetch('success.gif').then(function(response) {
      return response.blob();
  }).then(function(response) {

      var url = URL.createObjectURL(response);
      img.src = url;

  });
}

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
* Parses the current JSON Object and fills the status table rows with the
* content.
* Requires a JSON object.
**/

populateTable = function(json) {

  var statusTable = document.getElementById('status-table');
  var tableBody = document.getElementById('status-table-body');
  //clearTableRows(statusTable);

  //Insert the values from the current JSON file into the table
  for(var i = 0; i < currentJSON.length; i++) {
    var row = tableBody.insertRow(i);
    for(var j = 0; j < Object.keys(currentJSON[0]).length; j++) {
      var cell = row.insertCell(j);
      var currentKey = Object.keys(currentJSON[i])[j];
      var currentValue = currentJSON[i][currentKey];
      cell.innerHTML = currentValue;
    }

    //Add the action button to the final cell
    var cell = row.insertCell(currentJSON.length);
    cell.innerHTML = '<button class="btn btn-start" onclick="toggleBtn(this)">Start</button>';
    tableBody.remove();
  }

  // console.log(json);
  // var length = json.length;
  // for(var i = 0; i < length; i++) {
  //   console.log(json[i].id);
  //   console.log(json[i].ip);
  //   console.log(json[i].task);
  //   console.log(json[i].workload);
  // }
}


/**
* Returns an IPv4 as well as IPv6 address as a numerical value.
* Requires an IPv4 or IPv6 address as a string.
*/
var ipToValue = function(ip) {
  //Try to split into IPv6
  var currentIP = ip.split(":");

  //WE have an IPv6 Address
  if(currentIP.length > 1) {

    //Remove the attachment ["/64"] at the end of the Address
    currentIP = ip.split("/");
    currentIP = currentIP[0];
    currentIP = currentIP.split(":");

    //Turn each position into its binary value
    for(var i = 0; i < currentIP.length; i++) {
      currentIP[i] = parseInt("0x" + currentIP[i]).toString(2);
    }

    //Ensure all positions are represented as 16-bit
    for(var i = 0; i < currentIP.length; i++) {
      if(currentIP[i].length < 16) {
        var zeros = 16 - currentIP[i].length;
        var newBinary = "";
        for(var j = 0; j < zeros; j++) {
          newBinary += "0";
        }
        newBinary += currentIP[i];
        currentIP[i] = newBinary;
      }
    }

    //Concatenate the result to a 128-bit binary number
    var valueString = "";
    for(var k = 0; k < currentIP.length; k++) {
      valueString += currentIP[k];
    }

    //Convert the final value String into an integer
    console.log("The numberical Value of the IPv6 is: " + parseInt(valueString, 2));
    return parseInt(valueString, 2);
  }
  else { //We have an IPv4 Address
    currentIP = ip.split(".");
    //Turn each array position into its binary value
    for(var i = 0; i < currentIP.length; i++) {
      currentIP[i] = parseInt(currentIP[i]).toString(2);
    }

    //Ensure all positions are represented as 8-bit
    for(var i = 0; i < currentIP.length; i++) {
      if(currentIP[i].length < 8) {
        var zeros = 8 - currentIP[i].length;
        var newBinary = "";
        for(var j = 0; j < zeros; j++) {
          newBinary += "0";
        }
        newBinary += currentIP[i];
        currentIP[i] = newBinary;
      }
    }
      //Concatenate the result to a 32-bit binary number
      var valueString = "";
      for(var k = 0; k < currentIP.length; k++) {
        valueString += currentIP[k];
      }

      //Convert the final value String into an integer
      console.log("The numberical Value of the IPv4 is: " + parseInt(valueString, 2));
      return parseInt(valueString, 2);
    }
}

/**
* Requires a table-object and clears all it's rows.
*
*/
var clearTableRows = function(currentTable) {
  var rowCount = currentTable.rows.length;
  console.log("RowCount is: " + rowCount);
  //Skipping the header row with 1
  for(var i = 1; i < rowCount; i++) {
    console.log("Deleting row position " + i + " of " + rowCount);
    ///currentTable.deleteRow(i);
  }
}
