/**
* Inititialises the CNC-Interface and should be the last JS-File in the HTML
* script order.
*/

//If the page was force-reloaded when pointing an an element we need to load that section
if(window.location.hash) {
  var elem = window.location.hash;
  var menuLinks = document.querySelectorAll(".menu-link");
  var currentLink;
  var currentLinkTarget;
  //Find the corresponding menu item
  for(var i = 0; i < menuLinks.length; i++){
    currentLink = menuLinks[i];
    currentLinkTarget = currentLink.getAttribute('href');
    if(currentLinkTarget === elem) {
      break;
    };
  };

  if(currentLinkTarget === "#home") {
    loadPage('home-slide', currentLink);
  } else if(currentLinkTarget === "#status") {
    loadPage('status-table', currentLink);
  } else if (currentLinkTarget === "#tasks") {
    loadPage('tasks-table', currentLink);
  };

} else {
  //No hash means we're looking at home
  var homeLink = document.querySelector(".home");
  loadPage("home-slide", homeLink);
  console.log("NO HASH!");
};

//Inititate the status table
composeTable(statusServer, statusTableContainer);

//Inititate the task table
composeTable(tasksServer, taskTableContainer);

//Refresh the Status table within an adequate interval of time
setInterval(function(){
  composeTable(statusServer, statusTableContainer);
}, 5000);
