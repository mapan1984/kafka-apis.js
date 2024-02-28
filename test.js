const protocol = require('./protocol')
const Client = require('./client')


const host = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || 9092
const clientId = process.argv[4] || 'test'
const groupId = process.argv[5] || 'test'
const topics = process.argv.slice(6)


const request0 = new protocol.MetadataRequestEncoder()
    .correlationId(0)
    .clientId(clientId)
    .encode()
console.log('request buffer: ', request0)

const request1 = new protocol.MetadataRequestEncoder()
    .correlationId(1)
    .clientId(clientId)
    .topics(...topics)
    .encode()

const request2 = new protocol.FindCoordinatorRequestEncoder()
    .correlationId(2)
    .groupId(groupId)
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
