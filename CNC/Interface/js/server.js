/**
* Handles all functional programming for POST requests to the Bot Servers
* By ForkGitIT
*/

/**
* Toggles the STOP/START buttons according to the workload in the status table.
*/
function toggleStatus(btn) {

	//Set headers
	var myHeaders = new Headers();
	myHeaders.append('Content-Type','application/json');

	//Get the current BOT ID
	var id = parseInt(btn.getAttribute('data-id'));

	//Set the status based on the state of the button
	var status;
	if(btn.innerHTML == "Start") {
		status = true;
	} else {
		status = false;
	};

	//Compose the data packet
	var data = {
		id: id,
		status: status
	};

	//Set the request info
	var myInit = {
		method:"POST",
		headers: myHeaders,body: JSON.stringify(data),
		mode: 'cors',
		cache: 'default'
	};
	var request = new Request("http://localhost:3000/api/Status", myInit);

	fetch(request).then((response) => {
		return response.json();
	}).then((json) => {
		console.log(json);
		composeTable(statusServer, statusTableContainer);
	});
};


/**
* Creates a new task on the Task Server
*/
function postRequestTasks(data) {
	var myHeaders = new Headers();
	myHeaders.append('Content-Type','application/json');

	var myInit = {method:"POST",headers: myHeaders,body: JSON.stringify(data), mode: 'cors',cache: 'default'};
	var request = new Request("http://localhost:3000/api/Tasks/" ,myInit);

	fetch(request).then((response) => {
		return response.json();
	}).then((json) => {
		console.log(json);
		var dialog = document.querySelector(".dialog-container");
		var msg = document.createElement("P");
		msg.classList.add("msg");
		if(json.message == "OK") {
			dialog.classList.add("success");
			msg.innerHTML="The task was successfully added [Click Refresh Table to view]";
		} else {
			dialog.classList.add("fail");
			msg.innerHTML="An error occured and the task was not added.";
		};
		var currentForm = document.querySelector("form");
		currentForm.reset();
		dialog.appendChild(msg);
		setTimeout(resetDialog, 5000);
	});
}

/**
* Resets the dialog container
*/
var resetDialog = function() {
	var dialog = document.querySelector(".dialog-container");
	dialog.innerHTML="";
	dialog.classList.remove("success", "fail");
};
