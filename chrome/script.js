let checkIfGame = /(?=.*?[A-Z].*[A-Z])https:\/\/lichess.org\/\w{8,}/
let link = window.location.href;
let isGame = checkIfGame.test(link);

$( document ).ready(function() {
  if (isGame) {
    console.log("this is a game")
  chrome.runtime.sendMessage({ready: "true"}
  //, function(response) {
//  }
);




}
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('got');
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.reload === "true")
      document.write("Processing..");
      sendResponse({reloading: "true"});
      location.reload();
  });
