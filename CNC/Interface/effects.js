/**Loads the individual sections from the main-menu into the viewport*/
var loadPage = function(id, menuLink){
  //Activate section
  var sectionList = document.querySelectorAll("section");
  for(var i = 0; i < sectionList.length; i++) {
    if(sectionList[i].id == id) {
      sectionList[i].classList.add("active");
    } else {
      sectionList[i].classList.remove("active");
    };
  };
  //Update menu
  var menuList = document.querySelectorAll(".menu-link");
  for(var i = 0; i < menuList.length; i++) {
    var currentMenuItem = menuList[i];
    if(currentMenuItem === menuLink) {
      currentMenuItem.classList.add("active");
    } else {
      currentMenuItem.classList.remove("active");
    };
  };
};
