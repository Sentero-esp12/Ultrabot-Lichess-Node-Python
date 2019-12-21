(()=>{
const lettersToN = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8
}
const checkIfGame = /(?=.*?[A-Z].*[A-Z])https:\/\/lichess.org\/\w{8,}/
let link = window.location.href;
let isGame = checkIfGame.test(link);
let board,rectBoard,bX,coord;
let dataField,dataToField;
let canvas=null,context=null;
let gameData, playerColor;

const checkForCoord = (e) =>
{
  window.removeEventListener('mousemove',checkForCoord);
  let x=e.screenX-e.clientX;
  let y=e.screenY-e.clientY;
  let boardF = $('cg-board')[0];
  let rect = boardF.getBoundingClientRect();
  rectBoard=rect;
  let X=rect.x,Y=rect.y,W=rect.width;
  X=X+x;
  Y=Y+y;
  coord[0]=X;
  coord[1]=Y;
  console.log(coord);
  chrome.runtime.sendMessage({board: coord});
}
const resezing = (e) =>
{   window.addEventListener('mousemove',checkForCoord)    }
const addFields = () =>
{
//let mainWrap=$('#main-wrap')[0];
let mainWrap=$('.game__meta')[0];
let data=document.createElement('div');
let dataTo=document.createElement('div');
mainWrap.appendChild(data);mainWrap.appendChild(dataTo);
dataField=data;dataToField=dataTo;
dataField.innerText='DataFrom';
dataField.style.width=350+'px';
dataField.style.wordWrap= 'break-word';
dataToField.innerText='DataTo';
dataToField.style.width=350+'px';
dataToField.style.wordWrap= 'break-word';
}

const createCanvas = () =>
{
  canvas = document.createElement('canvas');
  let rect = board.getBoundingClientRect();
  canvas.style.left=rect.x + "px";
  canvas.style.top=rect.y + "px";
  canvas.width = rect.width;
  canvas.style.zIndex = 10;
  canvas.height = rect.width;
  canvas.style.position='absolute';
  canvas.style.pointerEvents='none';
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
}

let oldX,oldY,oldW,oldXT,oldYT;
const drawSquares = (where,time) => {
context.clearRect(oldX, oldY, oldW, oldW);
context.clearRect(oldXT, oldYT, oldW, oldW);
let x = Math.round(rectBoard.x);
let y = Math.round(rectBoard.y);
let w = Math.round(rectBoard.width/8);
let from,to;
if (playerColor==='white') {
from = [lettersToN[where[0][0]],Number(where[0][1])];
to = [lettersToN[where[1][0]],Number(where[1][1])];
} else {
  from = [9-lettersToN[where[0][0]],9-Number(where[0][1])];
  to = [9-lettersToN[where[1][0]],9-Number(where[1][1])];
}
let xM = oldX = (from[0]-1)*w;
let yM = oldY = (8-from[1])*w;
let xT = oldXT = (to[0]-1)*w;
let yT = oldYT = (8-to[1])*w;
oldW = w;
drawRect([xM,yM],[xT,yT],w);
/*
context.beginPath();
context.rect(xM, yM, w, w);
context.rect(xT, yT, w, w);
context.fillStyle = 'RGBA(85,0,116,0.43)';
context.fill();*/
}


const drawRect = (a,b,c) =>
{
  context.beginPath();
  context.rect(a[0], a[1], c, c);
  context.rect(b[0], b[1], c, c);
  context.fillStyle = 'RGBA(85,0,116,0.43)';
  context.fill();
}

const playMove = (where,time) => {
  let from,to;
  let wait = Number(time);
  if (playerColor==='white') {
  from = [lettersToN[where[0][0]],Number(where[0][1])];
  to = [lettersToN[where[1][0]],Number(where[1][1])];
  } else {
    from = [9-lettersToN[where[0][0]],9-Number(where[0][1])];
    to = [9-lettersToN[where[1][0]],9-Number(where[1][1])];
  }
  let bw = rectBoard.width;
  let w = rectBoard.width/8;
  let x = rectBoard.x;
  let y = rectBoard.y;
 from[0] = (from[0]-1)*w+x+w/2;      from[1] = (8-from[1])*w+y+w/2;
 to[0] = (to[0]-1)*w+x+w/2;          to[1] = (8-to[1])*w+y+w/2;
  setTimeout(()=>{
  applyData(from,to);
  //drawRect([from[0]-w/4-x,from[1]-w/4-y],[to[0]-w/4-x,to[1]-w/4-y],w/2);
},wait)
}

const applyData = (from,to) => {
produceData(from[0],from[1]);
registerData(to[0],to[1])
}
const produceData = (x,y,el=board) => {
  const ev = new MouseEvent("mousedown", {
      "view": window,
      "bubbles": true,
      "cancelable": false,
      "clientX": x,
      "clientY": y,
  });
  //el.dispatchEvent(ev);
  board.dispatchEvent(ev);
}
const registerData = (x,y,el=board) => {
       const ev = new MouseEvent("mouseup", {
           "view": window,
           "bubbles": true,
           "cancelable": false,
           "clientX": x,
           "clientY": y
       });
      // el.dispatchEvent(ev);
      board.dispatchEvent(ev);
   }

$( document ).ready(function() {
  if (isGame) {
    let checkNumber = $('.setup')[0].innerText.numbersCode().indexOf('00520061007400650064');
    if (checkNumber>=0) {chrome.runtime.sendMessage({numberFound: "true"});}
    else {
      chrome.runtime.sendMessage({numberFound: "false"});
    board = $('cg-board')[0];
    rectBoard = board.getBoundingClientRect();
    bX=rectBoard.x,bY=rectBoard.y,bW=rectBoard.width;
    coord = [bX,bY,bW,bW];
    console.log("this is a game")
    chrome.runtime.sendMessage({ready: "true"});
    window.addEventListener('resize', resezing)
    window.addEventListener('mousemove',checkForCoord)
    addFields();
    createCanvas();
    readDataString();

  }


}
});


const checkIfMove = (maybeMove) => {
let content = maybeMove;
if (content !== void 0 && content.move !== void 0 && content.time !== void 0)
{
let move=content.move.match(/.{1,2}/g);
let time=content.time;
drawSquares(move,time);
                    if (content.play !== void 0)
                              {
                               playMove(move,time);
                              }
}

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log('got');
    /*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
    if (request.reload === "true") {
      document.write("Processing..");
      sendResponse({reloading: "true"});
      location.reload();
    } else if (request.need === "board") {
      sendResponse({board: coord});
    }
    else if (request.info) {
let where=request.info;
let text=where[1];
text=text.replace(/\\/g, '');
if (where[0]==='toPython'){ dataToField.innerText='to Python ---> '+text }
else
{ dataField.innerText='from Python <--- '+text;

if (text[0]==='{')  checkIfMove(JSON.parse(text));

}
console.log(where[0])
    }
  });


  String.prototype.numbersCode = function(){
      var hex, i;
      var result = "";
      for (i=0; i<this.length; i++) {
          hex = this.charCodeAt(i).toString(16);
          result += ("000"+hex).slice(-4);
      }
      return result
  }
const parseMoves = (moves) => {
  let splitted = moves.split(' ');
  let movesObject = {};
  for (let i=0;i<splitted.length;i++)
  {
    let divided = splitted[i].match(/.{1,2}/g);
    let piece = divided[0];
    let dests = divided.slice(1);
    movesObject[piece]=dests.join('');
  }
  return movesObject;
}


const readDataString = () => {
  try {
          let script = document.getElementsByTagName('script')[2].textContent;
          script = script.substr(script.indexOf('data":') + 6);
          script = script.substr(0, script.indexOf('i18n'));
          script = script.substr(0, script.lastIndexOf(',')).trim();
          let data = gameData = JSON.parse(script);
          console.log(data);
          defineParameters(data);
          data.possibleMoves=parseMoves(data.possibleMoves);
          chrome.runtime.sendMessage({move: [data,null]})
      } catch(e) {
          console.log(e,'The game data isn\'t available.');
      }
}

const defineParameters = (data) => {
playerColor = data.player.color;
}


})()
