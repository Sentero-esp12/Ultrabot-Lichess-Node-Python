



module.exports = (handleMessage) => {



  process.stdin.on('readable', () => {
    var input = []
    var chunk
    while (chunk = process.stdin.read()) {
      if (chunk[0]===45&&chunk[1]===49&&chunk.length===2) {
//sendMessage({message: 'python', body: chunk});
        process.exit();
      }
      input.push(chunk)

    }
    input = Buffer.concat(input)

 //const fs = require('fs');
//  fs.writeFile("logs.js", '7777777777777777', function(err) {  });









    if (Buffer===-1) {
      process.exit();
    }
//sendMessage({message: 'python', body: Buffer});
 //console.log('\u0007');

    var msgLen = input.readUInt32LE(0)
    var dataLen = msgLen + 4

    if (input.length >= dataLen) {
      var content = input.slice(4, dataLen)
      var json = JSON.parse(content.toString())
      handleMessage(json)

      if (json===-1) {
        process.exit();
      }


    } else {
      var content = input.slice(0);
      var json = JSON.parse(content.toString())
      handleMessage(json)
    }
  })

  function sendMessage (msg) {
    var buffer = Buffer.from(JSON.stringify(msg))

    var header = Buffer.alloc(4)
    header.writeUInt32LE(buffer.length, 0)

    var data = Buffer.concat([header, buffer])
    process.stdout.write(data)
  }

  process.on('uncaughtException', (err) => {
    sendMessage({error: err.toString()})
  })

  return sendMessage

}
