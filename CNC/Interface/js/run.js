/**
* Inititialises the CNC-Interface and should be the last JS-File in the HTML
* script order.
*/

//Sections - contains the CNC-Interface sections as objects
let sections = [];

//Initiate the main section-objects
const tasks = {
	"title" : "Task Table [Bots]",
	"section" : "tasks-table",
	"server" : "http://localhost:3000/api/Tasks",
	"sort" : {
		"column" : "id",
		"dataType" : "number"
	}
};
sections.push(tasks);

const status = {
	"title" : "Status Table [Bots]",
	"section" : "status-table",
	"server" : "http://localhost:3000/api/Status",
	"sort" : {
		"column" : "id",
		"dataType" : "number"
	}
};
sections.push(status);

const bots = {
	"title" : "BOTS Report",
	"section" : "bots-table",
	"data" : JSON.parse(fs.readFileSync('./report/report.json', 'utf-8', ((err) => {
		if (err) {
			throw err;
		}
	}))),
	"sort" : {
		"column" : "id",
		"dataType" : "number"
	}
};
sections.push(bots);

let refreshSection = function(obj) {
	if (typeof obj.server === "undefined") {
		sortData(obj);
		composeTable(obj);
	} else {
		fetch(obj.server).then((response) => {
			return response.json();
		}).then((json) => {
			obj["data"] = json;
			sortData(obj);
			composeTable(obj);
		});
	}
};

//Inititalise the CNC-Interface tables
sections.map(section => {
	refreshSection(section);
});

//Refresh the Status table within an adequate interval of time
setInterval(function() {
	refreshSection(status);
}, 5000);

//If the page was force-reloaded while the user was in a specific section
//ensure to load that session as the first screen.
if (window.location.hash) {
	let menuLinks = document.querySelectorAll(".menu-link");
	menuLinks.forEach(function(currentElem) {
		if (currentElem.getAttribute('href') === window.location.hash) {
			loadPage(currentElem.getAttribute('data-anchor'), currentElem);
		}
	});
} else {
	loadPage(document.querySelector(".home").getAttribute('data-anchor'), document.querySelector(".home"));
}
