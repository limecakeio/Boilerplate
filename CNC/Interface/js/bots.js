/** Handles the business-logic of the bot-view*/

//Processing variables
let processingTasks = false;
const crypto = require('crypto');
const botProtcol = document.querySelector("#bot-protocol");
const fs = require('fs');

//Listen to the menu-toggler
const processToggler = document.querySelector("#bot-toggler");
processToggler.onchange = function() {
	toggleTaskProcessing();
};

const toggleTaskProcessing = function () {
	if (processingTasks) {
		botProtcol.innerHTML = " ";
		processingTasks = false;
	} else {
		processingTasks = true;
	}
};

/*This function is periodically called to check if tasks are to be processed*/

const taskProcessCheck = function() {
	if (processingTasks) {
		botProtcol.innerHTML = "";
		processTasks();
	}
};

const processTasks = function() {
  //Filter out any tasks that have been processed already
	let currentTasks = tasks.data.filter((item) => {
		return item.data.output === null;
	});

  //If nothing is left post-filtering, all tasks have been processed
	if (currentTasks.length === 0) {
		toggleTaskProcessing(); //Cease processing
		setTimeout(function() { //Inform user that all tasks are done
			document.getElementById("bot-toggler").checked = false;
			let noTasksMsg = document.createElement("P");
			noTasksMsg.classList.add("task-complete-msg");
			noTasksMsg.innerHTML = "No more tasks to process";
			botProtcol.appendChild(noTasksMsg);
		}, 1000);
	} else {
    //Choose a random position within the array for processing, thus limiting the
    //chances of multiple clients working on the same problem.
		let randomPosition = Math.floor(Math.random() * currentTasks.length);
		let currentTask = currentTasks[randomPosition];

    //Remove the task that is to be processed from the local copy
		currentTasks.splice(randomPosition, 1);

    //Alert user of the task that's being processed
		let currentTaskMsg = document.createElement("P");
		currentTaskMsg.innerHTML = "Processing Task ID: " + currentTask.id;
		botProtcol.appendChild(currentTaskMsg);

    //Encrypt the input
		let hashType = currentTask.type.split("-");
		let falseHashType = false;

		if (hashType[0] === "hash") {
      //Calculate has and set it as output
			let hashSum = crypto.createHash(hashType[1]);
			hashSum.update(currentTask.data.input);
			currentTask.data.output = hashSum.digest('hex');

      //Inform the user that the task has been processed
			let hashOkTaskMsg = document.createElement("P");
			hashOkTaskMsg.innerHTML = "Input successfully hashed.";
			botProtcol.appendChild(hashOkTaskMsg);
		} else {//Invalid hash-type [like crack-md5]
			falseHashType = true;
			currentTask.data.output = "N/A";
		}

      //Sync the results with the server
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('token', 'limecakeio');
		const requestHeaders = {
			method:"POST",
			headers: headers, body: JSON.stringify(currentTask),
			mode: 'cors',
			cache: 'default'
		};
		const postRequest = new Request("http://localhost:3000/api/Reports", requestHeaders);
		fetch(postRequest).then((response) => {
			return response.json();
		}).then((data) => {
			currentTask["sync"] = data.message;
			if (falseHashType) {
				currentTask["sync"] += "\n ERROR: Unsupported Hash-Type";
			}
			bots.data.push(currentTask);
			refreshSection(tasks);
			refreshSection(bots);
		});
	}

  //Save a sorted and persistent copy of the report upon the window closing
	window.onunload = function() {
		bots.data.sort((a, b) => {
			return a.id - b.id;
		});
		fs.writeFile("./report/report.json", JSON.stringify(bots.data), (err) => {
			if (err) {
				throw err;
			}
		});
	};
};

/**Check periodically if we need to process tasks.
* This enables us to "pause" the process.
*/

setInterval(function() {
	taskProcessCheck();
}, 2000);
