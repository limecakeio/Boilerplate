/**
* Sets the state of the sorting order of the table the header belongs to
*/
var sortBy = function(obj) {

  //Keep track of descenting or ascenting
  clickCount++;

  //Get the container, field name and type to save the sorting status-table
  var sortContainer = obj.getAttribute("data-ref");
  var sortField = obj.getAttribute("data-field");
  var sortType = obj.getAttribute("data-type");
  var dataSource;

  //Define which data source to sort
  if(sortContainer == "status-table") {
    statusTableSort = [sortContainer, sortField, sortType];
    dataSource = statusServer;
  } else if(sortContainer == "tasks-table") {
    tasksTableSort = [sortContainer, sortField, sortType];
    dataSource = tasksServer;
  };

  composeTable(dataSource, sortContainer);
};

/**
* Sorts a JSON Object dependent on the sorting state array of its display container
*/
var sortData = function(data, state) {
  //Are we ascenting or descenting
  var isEven = (clickCount % 2 == 0);

  //Define which field and type to sort
  var sortField = state[1];
  var sortType = state[2];

  if(sortType == "number") {
    if(isEven) {
      data.sort(function(a,b) {
        return a[sortField] - b[sortField];
      });
    } else {
      data.sort(function(a,b) {
        return b[sortField] - a[sortField];
      });
    };
  } else if(sortType == "string"){
    if(isEven) {
      data.sort();
    } else {
      data.reverse();
    };
  } else if(sortType == "ip") {
    if(isEven) {
      data.sort(function(a,b) {
      return parseIP(a[sortField]) - parseIP(b[sortField]);
      });
    } else {
      data.sort(function(a,b) {
        return parseIP(b[sortField]) - parseIP(a[sortField]);
      });
    };
  };
};


/*
* Returns an IPv4 as well as IPv6 address as a numerical value.
* Requires an IPv4 or IPv6 address as a string.
*/
var parseIP = function(ip) {
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
      return parseInt(valueString, 2);
    }
}
