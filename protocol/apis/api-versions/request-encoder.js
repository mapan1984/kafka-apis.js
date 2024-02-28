const RequestEncoder = require('../../base/request')

class ApiVersionsRequestEncoder extends RequestEncoder {
    constructor() {
        super()

        this.apiKey = [
            0, 18,  // ApiKey 18 ApiVersions
        ]
    }

    encode() {
        return super._encode(null)
    }
}

module.exports = ApiVersionsRequestEncoder
