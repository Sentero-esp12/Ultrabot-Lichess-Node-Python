# Ultrabot-Lichess-Node-Python
We want to create an ultrabullet bot which plays like a human. We are welcoming any contributors with a variety of programming languages
# Installation
Important: as of now works on Chrome, Windows (can be modified for other OS and browsers). 

1. Install Node (add to path)
2. Install Python (add to path)
3. Download the repository.
4. Create a folder `C:\PythonJScollab` and put there the files from the repository.
5. Create a key in the registry (for Windows): 
HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\python.javascript.collab
with a value:
C:\PythonJScollab\nodejs\chrome\python.javascript.collab.json
6. Enable developer mode in Chrome on this page (chrome://extensions)
7. Click "Load unpacked".
8. Navigate there to the folder C:\PythonJScollab\chrome then click `open` from inside the folder.
9. Create a game on Lichess to test. See output in the console (F12), or the background page console (go to chrome://extensions and click `background` for this extension)
