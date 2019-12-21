## compute_input.py

#!/usr/bin/python
import sys
import json
import random

def process(line):
    #return len(line)
    return line

def iterateAndChoose(PosMoves):
  numberOfPieces = len(PosMoves)
  #print(numberOfPieces)
  if numberOfPieces > 1:
    randomPiece = random.randrange(numberOfPieces-1)
  else:
    randomPiece = 0
  #print(randomPiece)
  chosenP = list(PosMoves)[randomPiece]
  ListOfDest = PosMoves[chosenP]
  numberOfDests = len(ListOfDest)
  if numberOfDests > 1:
    randomDest = random.randrange(numberOfDests-1)
  else:
    randomDest = 0
  chosenD = ListOfDest[randomDest]
  toSendDict = {  # multiline format
  "move": chosenP+chosenD,
  "time": "0",
  "play": "true"
  }
  toSend = json.dumps(toSendDict)
  print(toSend)
  #print(chosenP,chosenD)
  #logWrite(toSend)
  #print(chosenP,chosenD)

def moveProcess(line):
  parsed = json.loads(line)
  PosMoves = parsed["possibleMoves"]
  if PosMoves is not None:
     iterateAndChoose(PosMoves)
  PosMoveStr = json.dumps(PosMoves)
  #logWrite(PosMoveStr)
  #logWrite('eff')
  #return 12
  #return



def logWrite(data):
  f = open("../python/logs.txt", "w")
  f.write(data)
  f.close()
  #return

try:
    while True:
        line = input()
        #print(process(line))
        #logWrite(line)
        #f = open("../python/logs.txt", "w")
        #f.write(line)
        #f.close()
        #print('{"move":"a2a4","time": "500", "play": "true"}')
        moveProcess(line)
        #y = json.loads(x)
except EOFError:
    pass
