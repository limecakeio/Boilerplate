/**
* Handles all functional programming for POST requests to the Bot Servers
* By ForkGitIT
*/

/**
* Toggles the STOP/START buttons according to the workload in the status table.
*/

let toggleStatus = function(btn) {

	//Set headers
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('token', 'limecakeio');

	//Get the current BOT ID
	let id = parseInt(btn.getAttribute('data-id'));

	//Set the status based on the state of the button
	let status;
	if (btn.innerHTML === "Start") {
		status = true;
	} else {
		status = false;
	}

	//Compose the data packet
	let data = {
		id: id,
		status: status
	};

	//Set the request info
	let myInit = {
		method:"POST",
		headers: myHeaders, body: JSON.stringify(data),
		mode: 'cors',
		cache: 'default'
	};
	let request = new Request("http://localhost:3000/api/Status", myInit);

	fetch(request).then((response) => {
		return response.json();
	}).then((json) => {
		//Why so tricky? Variable: Status is conflicting with fetch-boolean by the same name.
		refreshSection(sections.find(section => {
			return section.section === "status-table";
		}));
	});
};

/**
* Creates a new task on the Task Server
*/

let postRequestTasks = function(data) {
	let myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('token', 'limecakeio');

	let myInit = {
		method:"POST",
		headers: myHeaders,
		body: JSON.stringify(data),
		mode: 'cors',
		cache: 'default'
	};
	let request = new Request("http://localhost:3000/api/Tasks/", myInit);

	fetch(request).then((response) => {
		return response.json();
	}).then((json) => {
		let dialog = document.querySelector(".dialog-container");
		let msg = document.createElement("P");
		msg.classList.add("msg");
		if (json.message === "OK") {
			dialog.classList.add("success");
			msg.innerHTML = "The task was successfully added [Click Refresh Table to view]";
		} else {
			msg.innerHTML = "An error occured and the task was not added.";
			dialog.classList.add("fail");
		}
		let currentForm = document.querySelector("form");
		currentForm.reset();
		dialog.appendChild(msg);
		setTimeout(resetDialog, 5000);
	});
};

let resetDialog = function() {
	let dialog = document.querySelector(".dialog-container");
	dialog.innerHTML = " ";
	dialog.classList.remove("success", "fail");
};
