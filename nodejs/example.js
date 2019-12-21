#!/home/s/.nvm/versions/node/v8.11.2/bin/node

// Might be good to use an explicit path to node on the shebang line
// in case it isn't in PATH when launched by Chrome

const fs = require('fs');
const sendMessage = require('../protocol')(handleMessage);
let isActive=true;
let activeCount=0;
  //fs.writeFile("logs.js", '11111111', function(err) {  });
    //fs.writeFile("../logs.js", '11111111', function(err) {  });
//sendMessage({message: 'python', body: 'is it working'});



var spawn = require('child_process').spawn,
    py    = spawn('python', ['../python/pythonLichess.py']),
    data = [1,2,3,4,5,6,7,8,9],
    dataString = '';

py.stdout.on('data', function(data){
  dataString += data.toString();
  sendMessage({message: 'python', body: 'received data from python'});
  let toSend;
  for (let i=0;i<data.length;i++) {
    toSend+=String.fromCharCode(data[i]);
  }
  let ind=toSend.indexOf('{');
if (ind!==-1) {toSend=toSend.slice(ind)}
toSend = toSend.replace(/\r?\n|\r/g, '');
  sendMessage({message: 'python', body: {fromPy: toSend}});
});
py.stdout.on('end', function(){
  //console.log('Sum of numbers=',dataString);
  sendMessage({message: 'python', body: dataString});
});
/*py.stdin.write(JSON.stringify(data));
py.stdin.end();*/



let activeCheckInt = setInterval(()=>{
  //process.exit();
  //if (isActive===true) {
sendMessage({message: 'isActive', body: 'isActive'});
isActive=false;activeCount++;
if (activeCount>=3&&isActive===false) {process.exit();}
//}
},1000)


function handleMessage (req) {
fs.writeFile("logs.js", JSON.stringify(req), function(err) {  });
  //sendMessage({message: 'python', body: 'handleMessage'});
if
  (req.message === 'round')
  {
  //try {  let modified = searching(req.body);
//sendMessage({message: 'pong', body: req.body});
  //}
  //catch(e) {sendMessage({message: 'pong', body: "err"});}
searching(req.body);
  }
  else if (req.message === 'move')
  {
    sendMessage({message: 'python', body: 'sending data to python'});
    py.stdin.write(JSON.stringify(req.body)+'\r\n');
    //py.stdin.end();
  }
  else
  if (req.message === 'active')
  {
    isActive=true;
    activeCount=0;
  }
}


let regex = /[a-z][.]possibleMoves=[a-z][?][a-z][.]dests:void 0/g
String.prototype.replaceBetween = function(start, end, what) {
  return this.substring(0, start) + what + this.substring(end);
};

const searching = (file) => {

//var possibleMoves = file.match(regex);
let pmI = regex.exec(file);
let index = pmI.index;
let found = pmI[0];
  //sendMessage({message: 'pong', body: found});
let newString = file.replaceBetween(index,found.length+index,found+',console.log(this.data,e),chrome.runtime.sendMessage("adpnhlnmobdngbdhlmpfpanecbihehfa", {move: [this.data,e]})');
newString = 'console.log("success");chrome.runtime.sendMessage("adpnhlnmobdngbdhlmpfpanecbihehfa", {success: "success"});'+newString;
  sendMessage({message: 'processing', body: newString});
  writeToFile(newString);

//return "console.log('searchingTest')"+newString;
}


const writeToFile = (newString) =>
{
  fs.writeFile("../chrome/code.js", newString, function(err) {
    setTimeout(()=>{
    sendMessage({message: 'finished', body: "finished writing"});
  },250)
    /*  if(err) {
          return console.log(err);
      }*/
    //console.log("The file was saved!");
  });
}
