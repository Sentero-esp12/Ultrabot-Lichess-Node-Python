(()=>{

let checkIfGame = /(?=.*?[A-Z].*[A-Z])https:\/\/lichess.org\/\w{8,}/
let link = window.location.href;
let isGame = checkIfGame.test(link);
let board,rectBoard,bX,coord;



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



  }


}
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('got');
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.reload === "true") {
      document.write("Processing..");
      sendResponse({reloading: "true"});
      location.reload();
    } else if (request.need === "board") {
      sendResponse({board: coord});
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
