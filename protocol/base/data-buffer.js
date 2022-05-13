class DataBuffer {
    constructor() {
        this.size = null
        this.currentPoint = 0
        this.data = null
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

    update(data) {
        if (this.data === null) {
            this.data = data
        } else {
            this.data = Buffer.concat([this.data, data])
        }

        if (this.data.byteLength < 4) {
            return false
        }

        if (this.size === null) {
            this.size = this.readIntBE(4)  // 请求体大小 int32
            console.log(`response size: ${this.size}`)
        }

        // 判断是否已经获取到响应的完整数据
        if (this.size <= this.data.byteLength - 4) {
            console.log(`response size: ${this.size}, data size: ${this.data.byteLength}`)
            // TODO: 保留多余的数据
            return true
        } else {
            return false
        }
    }
}

module.exports = DataBuffer

