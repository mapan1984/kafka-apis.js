const ResponseDecoder = require('../base/response')

class GroupCoordinatorResponseDecoder extends ResponseDecoder {
    constructor() {
        super()
        this.response = {
            errorCode: null,
            coordinatorId: null,
            coordinatorHost: null,
            coordinatorPort: null,
        }
    }

    decode() {
        let _response = super.decode()

        this.response = {..._response, ...this.response}

        let errorCode = this.readIntBE(2)  // int16
        this.response['errorCode'] = errorCode
        console.log(`errorCode: ${errorCode}`)

        let coordinatorId = this.readIntBE(4)  // int32
        this.response['coordinatorId'] = coordinatorId
        console.log(`coordinatorId: ${coordinatorId}`)

        let coordinatorHostLen = this.readIntBE(2)  // int16
        let coordinatorHost = this.readString(coordinatorHostLen)
        this.response['coordinatorHost'] = coordinatorHost
        console.log(`coordinatorHost: ${coordinatorHost}`)

        let coordinatorPort = this.readIntBE(4)  // int16
        this.response['coordinatorPort'] = coordinatorPort
        console.log(`coordinatorPort: ${coordinatorPort}`)

        return this.response
    }
}

module.exports = GroupCoordinatorResponseDecoder
