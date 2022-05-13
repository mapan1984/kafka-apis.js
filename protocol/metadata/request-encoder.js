const RequestEncoder = require('../base/request')

class MetadataRequestEncoder extends RequestEncoder {
    constructor() {
        super()

        this.apiKey = [
            0, 3,  // ApiKey 3 MetadataRequest
        ]

        this.topicsBytes = null
        this.defaultTopicMetadataRequest = [
            // TopicMetadataRequest
            0, 0, 0, 0  // Length 32 bytes，长度为 0 的空数组，表示获取全部元信息
        ]
    }

    topics(...topics) {
        this.topicsBytes = this.stringArray(topics)
        return this
    }

    encode() {
        if (this.topicsBytes === null) {
            this.topicsBytes = this.defaultTopicMetadataRequest
        }

        return super._encode(this.topicsBytes)
    }
}

module.exports = MetadataRequestEncoder

if (require.main == module) {
    const arraysEqual = require('../../utils/arraysEqual')

    let metadataRequestEncoder = new MetadataRequestEncoder()

    let clientIdBytes = metadataRequestEncoder.string('kafka-agent-client')
    console.log(clientIdBytes)
    console.log(arraysEqual(clientIdBytes, metadataRequestEncoder.defaultClientId))

    let topicsBytes = metadataRequestEncoder.stringArray([])
    console.log(topicsBytes)
    console.log(arraysEqual(topicsBytes, metadataRequestEncoder.defaultTopicMetadataRequest))
}
