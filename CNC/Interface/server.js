function toggleBtn(btn) {
	console.log(btn.getAttribute("data-id"));
	postRequestStatus(btn.getAttribute("data-id"));
};

function postRequestStatus(idval) {
var myHeaders = new Headers();
	    myHeaders.append('Content-Type','application/json');
    var data = {
        id: idval,
        status: false
    };
    var myInit2 = {method:"POST",headers: myHeaders,body: JSON.stringify(data), mode: 'cors',cache: 'default'};
    var request1 = new Request("http://botnet.artificial.engineering:80/api/Status",myInit2);

    fetch(request1).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
		composeTable(statusServer, statusTableContainer);
    });
}
	
function postRequestTasks(data){
    var myHeaders = new Headers();
	myHeaders.append('Content-Type','application/json');
	var myInit = {method:"POST",headers: myHeaders,body: JSON.stringify(data), mode: 'cors',cache: 'default'};
	var request = new Request("http://botnet.artificial.engineering:80/api/Tasks/" ,myInit);
	fetch(request).then((response) => {
    		return response.json();
		}).then((json) => {
    		
                 composeTable(tasksServer, taskTableContainer);
	});
}