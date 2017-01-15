/**
* Handles the transitions between menu items and slides
* By ForkGitIT
*/


/**Loads the individual sections from the main-menu into the viewport*/

let loadPage = function(id, menuLink) {
  //Activate section
	let sectionList = document.querySelectorAll("section");
	for (let i = 0; i < sectionList.length; i++) {
		if (sectionList[i].id === id) {
			sectionList[i].classList.add("active");
		} else {
			sectionList[i].classList.remove("active");
		}
	}
  //Update menu
	let menuList = document.querySelectorAll(".menu-link");
	for (let j = 0; j < menuList.length; j++) {
		let currentMenuItem = menuList[j];
		if (currentMenuItem === menuLink) {
			currentMenuItem.classList.add("active");
		} else {
			currentMenuItem.classList.remove("active");
		}
	}
};
