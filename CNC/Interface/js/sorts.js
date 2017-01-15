/**
* Handles all the sorting for the tables in the CNC-Interface
* By ForkGitIT.
*/

/**
* Sets the state of the sorting order of the table the header belongs to
*/

let sortBy = function(obj) {
  //Keep track of descenting or ascenting
	clickCount++;

  //Get the container, field name and type to save the sorting status-table
	let sortContainer = obj.getAttribute("data-ref");
	let sortField = obj.getAttribute("data-field");
	let sortType = obj.getAttribute("data-type");
  //Find the section we are working with
	let activeSection = sections.find(section => {
		return section.section === sortContainer;
	});

  //Set the sorting state of the selected section
	activeSection.sort.column = sortField;
	activeSection.sort.dataType = sortType;

	refreshSection(activeSection);
};

/**
* Sorts a JSON Object dependent on the sorting state array of its display container
*/

let sortData = function(obj) {
  //Are we ascenting or descenting
	let isEven = (clickCount % 2 === 0);

  //Define which field and type to sort
	let sortField = obj.sort.column;
	let sortType = obj.sort.dataType;

	if (sortType === "number") {
		if (isEven) {
			obj["data"].sort(function(a, b) {
				return a[sortField] - b[sortField];
			});
		} else {
			obj["data"].sort(function(a, b) {
				return b[sortField] - a[sortField];
			});
		}
	} else if (sortType === "string") {
		if (isEven) {
			obj["data"].sort();
		} else {
			obj["data"].reverse();
		}
	} else if (sortType === "ip") {
		if (isEven) {
			obj["data"].sort(function(a, b) {
				return parseIP(a[sortField]) - parseIP(b[sortField]);
			});
		} else {
			obj["data"].sort(function(a, b) {
				return parseIP(b[sortField]) - parseIP(a[sortField]);
			});
		}
	}
};


/*
* Returns an IPv4 as well as IPv6 address as a numerical value.
* Requires an IPv4 or IPv6 address as a string.
*/

let parseIP = function(ip) {
  //Try to split into IPv6
	let currentIP = ip.split(":");

  //WE have an IPv6 Address
	if (currentIP.length > 1) {

    //Remove the attachment ["/64"] at the end of the Address
		currentIP = ip.split("/");
		currentIP = currentIP[0];
		currentIP = currentIP.split(":");

		let ipSegments = currentIP.map(ip => {
      //The IP-Position into a binary value
			ip = parseInt("0x" + ip).toString(2);

      //Represent the value as 16-bit
			if (ip.length < 16) {
				let zeros = 16 - ip.length;
				let newBinary = "";

        //Filling up missing zeros
				for (let i = 0; i < zeros; i++) {
					newBinary += "0";
				}
				newBinary = newBinary + ip;
				ip = newBinary;
			}
			return ip;
		});

		let ipResult = ipSegments.join('');
		return parseInt(ipResult, 2);
	} else { //We have an IPv4 Address
		currentIP = ip.split(".");

		let ipSegments = currentIP.map(ip => {

      //Turn IP segment into its binary value
			ip = parseInt(ip).toString(2);

      //Ensure the IP segment is represented as 8-bits
			if (ip.length < 8) {
				let zeros = 8 - ip.length;
				let newBinary = "";
				for (let i = 0; i < zeros; i++) {
					newBinary += "0";
				}
				newBinary += ip;
				ip = newBinary;
			}
			return ip;
		});
		let ipResult = ipSegments.join('');
    //Convert the ipResult into an integer
		return parseInt(ipResult, 2);
	}
};
