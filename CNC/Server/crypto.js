/**
Needs to be post-integrated into the server module
*/
const crypto = require('crypto');
let fs = require('fs');

//Test Array DELETE BEFORE DEPLOY
let obj = {"id" : 3,
"type" : "hash-md5",
"data" : {
  "input" : "Anusan",
  "output" : null
}
};


fs.readFile('./bots.json','utf-8',(err,data) => {
 if (err) throw err;
 data = JSON.parse(data);
 let sync = "Not OK";

 //We don't want to process the same input and hash-type twice
 let findResult = data.find(findInputAndType);

 if(typeof findResult === "undefined") {//Calculate and set the hash for the given object
   let hashType = obj.type.split("-");
   //No support for "crack-"
   if(hashType[0] === "hash") {
     let hashSum = crypto.createHash(hashType[1]);
     hashSum.update(obj.data.input);
     obj.data.output = hashSum.digest('hex');
     sync = "Ok"
   }
 } else {
   obj.data.output = findResult.data.output;
 }

 //Add the sync result to the object
 obj.data["sync"] = sync;

 //Add the object to the bot list
 data.push(obj);

 //Write the updated data back to the file
 fs.writeFile("./bots.json", JSON.stringify(data), function(error) {
   if(err) {throw err;}
   console.log("File successfully written.");
 });

});

/*
Callback function for an array.find function call
Checks whether the current list of bots has already processed
a given input and hash-type and returns this object if it's the case.
*/
function findInputAndType(task) {
  //Look if the results contain an object that has previously processed the same input and hash-type
  return task.data.input === obj.data.input && task.type === obj.type;
}
