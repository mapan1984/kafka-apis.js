class RequestEncoder {
    constructor() {
        this.data = [
            // 0, 0, 0, 32,  // Size 32 bytes
            // 0, 3,  // ApiKey 3 MetadataRequest
            // 0, 0,  // ApiVersion 0
            // 0, 0, 0, 0,  // CorrelationId 0

            // clientId
            // 0, 18,  // string len 18 bytes
            // 107, 97, 102, 107, 97, 45, 97, 103, 101, 110, 116, 45, 99, 108, 105, 101, 110, 116, // string content `kafka-agent-client`
        ]

        this.size = null
        this.defaultSize = [
            0, 0, 0, 32,  // Size 32 bytes
        ]

        this.apiKey = [
            0, 3,  // ApiKey 3 MetadataRequest
        ]

        this.apiVersion = [
            0, 0,  // ApiVersion 0
        ]

        this.correlationId = [
            0, 0, 0, 0,  // CorrelationId 0
        ]

        this.clientIdBytes = null
        this.defaultClientId = [
            // clientId
            0, 18,  // string len 18 bytes
            107, 97, 102, 107, 97, 45, 97, 103, 101, 110, 116, 45, 99, 108, 105, 101, 110, 116, // string content `kafka-agent-client`
        ]
    }

    string(string) {
        // let content = new TextEncoder().encode(string)
        // content  = Array.from(content)
        let content = []
        for (let c of string) {
            content.push(c.charCodeAt())
        }

        let lenByte1 = 0xFF00 & content.length
        let lenByte2 = 0x00FF & content.length

        content.unshift(lenByte1, lenByte2)

        return content
    }

    stringArray(strings) {
        let lenByte1 = 0xFF000000 & strings.length
        let lenByte2 = 0x00FF0000 & strings.length
        let lenByte3 = 0x0000FF00 & strings.length
        let lenByte4 = 0x000000FF & strings.length

        let content = [
            lenByte1, lenByte2, lenByte3, lenByte4
        ]

        for (let string of strings) {
            content = content.concat(this.string(string))
        }

        return content
    }

    clientId(clientId) {
        this.clientIdBytes = this.string(clientId)
        return this
    }

    _encode(requestMessage) {
        if (this.clientIdBytes === null) {
            this.clientIdBytes = this.defaultClientId
        }

        let content = [].concat(
            this.apiKey,
            this.apiVersion,
            this.correlationId,
            this.clientIdBytes,
            requestMessage,
        )

        this.size = content.length

        this.sizeBytes = [
            0xFF000000 & this.size,
            0x00FF0000 & this.size,
            0x0000FF00 & this.size,
            0x000000FF & this.size,
        ]

        this.data = this.sizeBytes.concat(content)

        return Buffer.from(this.data)
    }
}

module.exports = RequestEncoder
