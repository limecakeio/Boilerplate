/**
* Inititialises the CNC-Interface and should be the last JS-File in the HTML
* script order.
*/

//If the page was force-reloaded when pointing an an element we need to load that section
if(window.location.hash) {
  var menuLinks = document.querySelectorAll(".menu-link");
  menuLinks.forEach(function(currentElem){
    if(currentElem.getAttribute('href') === window.location.hash) {
      loadPage(currentElem.getAttribute('data-anchor'), currentElem);
    }
  });
} else {
  loadPage(document.querySelector(".home").getAttribute('data-anchor'), document.querySelector(".home"));
};

//Inititate the status table
composeTable(statusServer, statusTableContainer);

//Inititate the task table
composeTable(tasksServer, taskTableContainer);

//Initiate the reports table
composeTable(botsServer, botsTableContainer);

//Refresh the Status table within an adequate interval of time
setInterval(function(){
  composeTable(statusServer, statusTableContainer);
}, 5000);
