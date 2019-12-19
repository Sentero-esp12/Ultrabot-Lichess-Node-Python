(()=>{

let checkIfGame = /(?=.*?[A-Z].*[A-Z])https:\/\/lichess.org\/\w{8,}/
let link = window.location.href;
let isGame = checkIfGame.test(link);
let board,rectBoard,bX,coord;
let dataField,dataToField;


const checkForCoord = (e) =>
{
  window.removeEventListener('mousemove',checkForCoord);
  let x=e.screenX-e.clientX;
  let y=e.screenY-e.clientY;
  let boardF = $('cg-board')[0];
  let rect = boardF.getBoundingClientRect();
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


  }


}
});


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
where[0]==='toPython'?dataToField.innerText='toPython ---> '+text:dataField.innerText=text;
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




})()
