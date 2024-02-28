const RequestEncoder = require('../../base/request')

class FindCoordinatorRequestEncoder extends RequestEncoder {
    constructor() {
        super()

        this.apiKey = [
            0, 10,  // ApiKey 10 GroupCoordinatorRequest
        ]

        this.groupIdBytes = null
        this.defaultGroupId = [
            // groupId
            0, 18,  // string len 18 bytes
            107, 97, 102, 107, 97, 45, 97, 103, 101, 110, 116, 45, 99, 108, 105, 101, 110, 116, // string content `kafka-agent-client`
        ]
    }

    groupId(groupId) {
        this.groupIdBytes = this.string(groupId)
        return this
    }

    encode() {
        if (this.groupIdBytes === null) {
            this.groupIdBytes = this.defaultGroupId
        }

        return super._encode(this.groupIdBytes)
    }
}

module.exports = FindCoordinatorRequestEncoder
