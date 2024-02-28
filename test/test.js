const protocol = require('../protocol')
const Client = require('../utils/client')


const host = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 9092
const topics = process.argv.slice(4)


const request0 = new protocol.MetadataRequestEncoder()
    .correlationId(0)
    .clientId('test')
    .encode()
console.log('request buffer: ', request0)

const request1 = new protocol.MetadataRequestEncoder()
    .correlationId(1)
    .clientId('test')
    .topics(...topics)
    .encode()

const request2 = new protocol.FindCoordinatorRequestEncoder()
    .correlationId(2)
    .groupId('test')
    .encode()

const request3 = new protocol.ApiVersionsRequestEncoder()
    .correlationId(3)
    .encode()



const client = new Client(host, port)
client.connect()

client.send(request0, new protocol.MetadataResponseDecoder(), res => console.log(res))
client.send(request1, new protocol.MetadataResponseDecoder(), res => console.log(res))
client.send(request2, new protocol.FindCoordinatorResponseDecoder(), res => console.log(res))
client.send(request3, new protocol.ApiVersionsResponseDecoder(), res => console.log(res))
