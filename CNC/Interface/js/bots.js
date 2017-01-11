/** Handles the business-logic of the bot-view*/

/*Globally set if tasks are to be processed or not*/
const toggleTaskProcessing = function() {
  if(processingTasks){
    processingTasks = false;
  } else {
    processingTasks = true;
  }
  composeTable(botsServer, botsTableContainer);
};

/*Is periodically called to check if tasks are to be processed*/
const taskProcessCheck = function() {
  if(processingTasks) {
    processTask();
  }
};

/** Sends the top-task to the server for processing and removes the task upon response*/
const processTask = function() {
  //Get the list of all tasks
  fetch(tasksServer).then((response) => {
    return response.json();
  }).then((json) => {
    //Grab the first element in the tasks table.
    let currentTask = json[0];

    //Check to see if all tasks have been processed
    if(typeof currentTask == "undefined") {
      console.log("NEEDS SOLUTION!");
      //Inform the user somehow that there are no tasks left to process
    } else { //Post the current task to the server
      //Set the request headers
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      let requestInfo = {
        method:"POST",
        headers: headers, body: JSON.stringify(currentTask),
        mode: 'cors',
        cache: 'default'
      };
      let postRequest = new Request("http://localhost:3000/api/Reports", requestInfo);
      fetch(postRequest).then((response) => {
        return response.json();
      }).then((data) => {
        composeTable(botsServer, botsTableContainer);
      });
    }
});
};

/**Check periodically if we need to process tasks.
* This enables us to "pause" the process.
*/
setInterval(function() {
  taskProcessCheck();
}, 1000);
