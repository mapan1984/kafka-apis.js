const net = require('net')
const util = require('util')

const protocol = require('./protocol')


const host = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 9092
const topics = process.argv.slice(4)


const request = new protocol.MetadataRequestEncoder()
    .clientId('test')
    .topics(...topics)
    .encode()
console.log('request buffer: ', request)


const metadataResponseDecoder = new protocol.MetadataResponseDecoder()


const client = new net.Socket()
client.connect(port, host, () => {
    console.log('Connected')
    client.write(request)
})

client.on('data', data => {
    // console.log('Received data(raw): ' + data)
    console.log(`Received data size ${data.byteLength}`)
    let end = metadataResponseDecoder.update(data)
    if (end) {
        console.log('end')
        let result = metadataResponseDecoder.decode()
        console.log(`result: ${
            util.inspect(
                result,
                {
                    showHidden: false,
                    depth: null,
                    // colors: true,
                    maxArrayLength: null
                }
            )}`)

        // client.end(() => {
        //     console.log('client end')
        // })
    }
})

client.on('close', () => {
    console.log('Connection closed')
})
