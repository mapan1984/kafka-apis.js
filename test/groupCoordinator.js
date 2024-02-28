const net = require('net')
const util = require('util')

const GroupCoordinatorRequest = require('./protocol/group-coordinator/request-encoder')
const GroupCoordinatorResponse  = require('./protocol/group-coordinator/response-decoder')


const host = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 9092

const groupId = process.argv[4]


const request = new GroupCoordinatorRequest()
    .groupId(groupId)
    .encode()

console.log('request buffer: ', request)


const groupCoordinatorResponseDecoder = new GroupCoordinatorResponse()


const client = new net.Socket()
client.connect(port, host, () => {
    console.log('Connected')
    client.write(request.data)
})

client.on('data', data => {
    // console.log('Received data(raw): ' + data)
    console.log(`Received data size ${data.byteLength}`)
    let end = groupCoordinatorResponseDecoder.update(data)
    if (end) {
        console.log('end')
        let result = groupCoordinatorResponseDecoder.decode()
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
