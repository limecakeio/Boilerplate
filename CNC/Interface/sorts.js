var sortColumn = function(obj) {
  var data;

  clickCount++;
  var isEven = (clickCount % 2 == 0);

  //Define which data source to sort
  if(obj.getAttribute("data-ref") == "status-table") {
    data = statusData;
  } else if(obj.getAttribute("data-ref") == "tasks-table") {
    data = tasksData;
  };

  //Define which field and type to sort
  var sortType = obj.getAttribute("data-type");
  var sortField = obj.getAttribute("data-field");
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
        a.sortField - b.sortField;
      });
    } else {
      data.sort(function(a,b) {
        b.sortField - a.sortField;
      });
    };
  };
  var allTableHeaders = document.querySelectorAll("th");
  //Remove all sorting classes
  for(var i = 0; i < allTableHeaders.length; i++) {
      allTableHeaders[i].classList.remove("descent", "ascent");
  };
  //Add relevant sorting classes to active object
  if(isEven) {
    obj.classList.add("descent");
  } else{
    obj.classList.add("ascent");
  };
  console.log(statusData);
};
