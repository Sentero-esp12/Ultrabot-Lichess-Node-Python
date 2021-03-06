let boardCoordinates=null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.reloading == "true")
  {
     console.log('the page is reloading');
}
else if (request.ready === "true") {
  console.log('ready');
}
else if (request.numberFound) {
  let checkN=request.numberFound;
  (((checkN==='true') && (checkVersion=false))||(checkVersion=true));
}
else if (request.board) {
  boardCoordinates=request.board.slice(0);
}
else if (request.move) {
  onMoveReceived(request.move);
}
/*else if (request.move) {
  let receivedMove=request.move;
  console.log(receivedMove);
}*/
      //sendResponse({reloading: "true"});
      //location.reload();

  });

let checkVersion=true;

const onMoveReceived = (move) => {
  let receivedMove=move;
  if (boardCoordinates) {
  receivedMove.push(boardCoordinates);
  organizeData(receivedMove);
} else {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
chrome.tabs.sendMessage(tabs[0].id, {need: "board"}, function(response) {
  if (response.board)
  {
    boardCoordinates=response.board
    receivedMove.push(boardCoordinates);
    organizeData(receivedMove);
  }
});
});


}
}


  chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      //if (sender.id == blocklistedExtension)
      //  return;  // don't allow this extension access
      //else
       //if (request.getTargetData)
      //  sendResponse({targetData: targetData});
      //else
       if (request.move) {
onMoveReceived(request.move);
      } else if (request.success)
      {
        console.log("success");
      }
    });

const pliescheck='\x72\x61\x74\x65\x64';
const findPossibles = (moves) => {
if (!moves) {return null} else {
for (const move in moves) {
moves[move]=moves[move].match(/.{1,2}/g);
}
return moves;
}
}

const messageToContent = (info,data) => {
  if (typeof data !== 'string') data=JSON.stringify(data);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {info: [info,data]});
  });
}

const organizeData = (move) => {
let toPython={};
move[1]&&(toPython.fen=move[1].fen||null);
move[1]&&(toPython.lastMove=move[1].uci||null);
toPython.currentPlayer=move[0].game.player||null;
toPython.color=move[0].player.color||null;let oppColor=move[0].opponent.color||null;let pliesV=move[0].game[pliescheck]||null;
move[1]&&(toPython.timePlayer=move[1].clock[toPython.color]*1000||null);
move[1]&&(toPython.timeOpp=move[1].clock[oppColor]*1000||null);
toPython.possibleMoves=findPossibles(move[0].possibleMoves)||null;
toPython.possiblePremoves=null||null;
toPython.isUnderCheck=null||null;
toPython.boardCoord=move[2]||null;
toPython.threefold=move[0].game.threefold||null;
toPython.piecesPosition=Chessboard.fenToObj(toPython.fen)||null;
console.log(toPython);
if (!pliesV) {port.postMessage({message: 'move', body: toPython});
messageToContent('toPython',toPython);


}
}



let NodeHasFinished = false;

var port = chrome.runtime.connectNative('python.javascript.collab')

port.onMessage.addListener((req) => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message)
  }
  handleMessage(req)
})

port.onDisconnect.addListener(() => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message)
  }
  console.log('Disconnected')
})

//port.postMessage({message: 'ping', body: 'hello from browser extension'});

/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.beep == "do")
     port.postMessage({message: 'ping', body: 'hello from browser extension'});
else if (request.beep == "do1")
port.postMessage({message: 'ping1', body: 'hello from browser extension'});

});*/


function handleMessage (req) {
  if (req.message === 'pong') {
    console.log(req);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {check: "time"}
   // , function(response) {
    //console.log(response.farewell);
  //}
  );
});
  }
  else
  if (req.message === 'processing') {
  console.log(req);
  }
  else
  if (req.message === 'finished') {
 console.log(req);
 //checkFile();
 reloadThePage();
  }
  else
  if (req.message === 'python')
  {
    console.log(req.body);
    messageToContent('fromPython',req.body.fromPy||req.body);
  }
  else
  if (req.message === 'isActive')
  {
    console.log('activeCheck');
port.postMessage({message: 'active', body: "true"});
  }
}

const checkFile = () => {
console.log(chrome.extension.getURL("code.js"))
try {
$.ajax({
url: chrome.extension.getURL("code.js"),
async: true,
type: 'GET',
success: function (data) {
      //result=data;
      console.log(data);
      //reloadThePage(data);
  },
});
} catch(e) {console.log(e)}
}

const reloadThePage = () => {
NodeHasFinished=true;console.log('NodeHasFinished true')
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {reload: "true"}, function(response) {
    console.log(response);
  });
});
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
let newString = file.replaceBetween(index,found.length+index,found+'console.log(this.data,e),chrome.runtime.sendMessage({move:[this.data,e]})')
console.log(pmI);
return newString;
}

const getFile = (a) => {
  //let result;
      $.ajax({
      url: a,
      async: true,
      type: 'GET',
      success: function (data) {
            //result=data;
            port.postMessage({message: 'round', body: data});
          console.log('data sent to node')
        },
  });
      //return result;
addListener();
}

const SyncGetFile = (url) => {
  try {
   getFile(url)
   //console.log(result)
   //return result;
 } catch(err) {
   console.log(err);
 }
}



const LichessUrl = { urls: ["https://lichess1.org/*"] };
const blocking = ["blocking"];
const getEverything = (details) => {
  //console.log(details);
   if(details.url.indexOf("lichess.round.min.js")!==-1)
    {
console.log(details);
      if (NodeHasFinished===false)
      {

removeListener();
SyncGetFile(details.url);
}

else if (NodeHasFinished===true)
{

  NodeHasFinished===false;console.log('NodeHasFinished false')
return { redirectUrl: chrome.extension.getURL("code.js") }
}

    }
}

const addListener = () => {
chrome.webRequest.onBeforeRequest.addListener(
  getEverything,
  LichessUrl,
  blocking
);
console.log('listener added')
}
const removeListener = () => {
     chrome.webRequest.onBeforeRequest.removeListener(getEverything);
     console.log('listener removed');
}
addListener();
