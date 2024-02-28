const EventEmitter = require("events").EventEmitter;

class DataBuffer extends EventEmitter {
    constructor() {
        super()

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

    // 更新内容，如果这个数据体已经结束，返回 true
    update(data) {
        console.log('update')

        if (data) {
            if (this.data === null) {
                this.data = data
            } else {
                this.data = Buffer.concat([this.data, data])
            }
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

            let correlationId = this.readIntBE(4)  // int32
            console.log(`correlationId: ${correlationId}`)

            let response = this.data.subarray(0, this.size + 4)
            this.data = this.data.subarray(this.size + 4)
            this.size = null
            this.currentPoint = 0

            // 获取到响应的完整数据，发送事件
            this.emit('responseEnd', response)

            return true
        } else {
            return false
        }
    }
}

module.exports = DataBuffer

if (require.main == module) {

    let buf1 = Buffer.allocUnsafe(6)

    let buf2 = buf1.subarray(0, 6)

    buf1 = buf1.subarray(6)


    console.log(buf2)
    console.log(buf1)
}
