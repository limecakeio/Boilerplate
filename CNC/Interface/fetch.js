this.setInterval(function() {fetchJSON();}, 5000);

doFetch = function() {
  var img = document.querySelector('#status img');

  fetch('success.gif').then(function(response) {
      return response.blob();
  }).then(function(response) {

      var url = URL.createObjectURL(response);
      img.src = url;

  });
}

fetchJSON = function() {
  fetch('http://botnet.artificial.engineering:80/api/Status').then((response) => {
    return response.json();
  }).then((json) => {
    populateTable(json);
});
};

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

this.fetchJSON();

populateTable = function(json) {
  var table = document.getElementById('status-table');
  var tableHead = document.getElementById('status-table-header');
  var tableBody = document.getElementById('status-table-body');

  //Populate Table Headings
  var row = tableHead.insertRow(0);
  var headerCell = document.createElement('TH');
  for(var i = 0; i < json.length; i++) {
    var heading = Object.keys(json[0])[i];
    row.insertCell(i).outerHTML = "<th>" + heading + "</th>";
  }
  //Add Action Header to the end
  row.insertCell(json.length).outerHTML = "<th>Aktion</th>";


  for(var i = 0; i < json.length; i++) {
    var row = tableBody.insertRow(i);
    for(var j = 0; j < Object.keys(json[0]).length; j++) {
      var cell = row.insertCell(j);
      var currentKey = Object.keys(json[i])[j];
      console.log(currentKey);
      var currentValue = json[i][currentKey];
      cell.innerHTML = currentValue;
    }
    //Add the action button to the final cell
    var cell = row.insertCell(json.length);
    cell.innerHTML = '<button class="btn btn-start" onclick="toggleBtn(this)">Start</button>';
  }

  var row = tableBody.insertRow(0);
  var cell1 = row.insertCell(0);
  // console.log(json);
  // var length = json.length;
  // for(var i = 0; i < length; i++) {
  //   console.log(json[i].id);
  //   console.log(json[i].ip);
  //   console.log(json[i].task);
  //   console.log(json[i].workload);
  // }
}
