class ResponseDecoder {
    constructor() {
        this.size = null
        this.currentPoint = 0
        this.data = null

        this._response = {
            size: null,
            correlationId: null,
        }
    }

    readIntBE(numOfByte) {
        let o = this.data.readIntBE(this.currentPoint, numOfByte)
        this.currentPoint += numOfByte
        return o
    }

    readString(numOfByte) {
        let o = this.data.toString(
            'utf8',
            this.currentPoint,
            this.currentPoint + numOfByte
        )
        this.currentPoint += numOfByte
        return o
    }

    // 这里应该传入完整的数据
    decode(data) {
        this.data = data

        if (this.data.byteLength < 4) {
            console.error(`response not end`)
            return
        }

        if (this.size === null) {
            this.size = this.readIntBE(4)  // 请求体大小 int32
            console.log(`response size: ${this.size}`)
            this._response['size'] = this.size
        }

        if (this.size > this.data.byteLength - 4) {
            console.error(`response not end`)
            return
        }

        console.log(`response size: ${this.size}, data size: ${this.data.byteLength}`)

        let correlationId = this.readIntBE(4)  // int32
        this._response['correlationId'] = correlationId
        console.log(`correlationId: ${correlationId}`)

        return this._response

    }
}

module.exports = ResponseDecoder
