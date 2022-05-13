const DataBuffer = require('./data-buffer')

class ResponseDecoder extends DataBuffer {
    constructor() {
        super()
        this._response = {
            size: null,
            correlationId: null,
        }
    }

    decode() {
        this._response['size'] = this.size
        console.log(`size: ${this.size}`)

        let correlationId = this.readIntBE(4)  // int32
        this._response['correlationId'] = correlationId
        console.log(`correlationId: ${correlationId}`)

        return this._response
    }
}

module.exports = ResponseDecoder
