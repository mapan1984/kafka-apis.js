const ResponseDecoder = require('../../base/response')

class ApiVersionsResponseDecoder extends ResponseDecoder {
    constructor() {
        super()
        this.response = {
            errorCode: null,
            apiKeys: [],
        }
    }

    decode(data) {
        let _response = super.decode(data)
        this.response = {..._response, ...this.response}

        let errorCode = this.readIntBE(2)  // int16
        this.response['errorCode'] = errorCode
        console.log(`errorCode: ${errorCode}`)

        // 获取全部 api key 信息
        let apiKeyNum = this.readIntBE(4) // 数组长度

        for (let i = 0; i < apiKeyNum; i++) {
            let apiKey = this.readIntBE(2);
            let minVersion = this.readIntBE(2);
            let maxVersion = this.readIntBE(2);

            this.response.apiKeys.push({
                apiKey: apiKey,
                minVersion: minVersion,
                maxVersion: maxVersion,
            })
        }

        return this.response
    }
}

module.exports = ApiVersionsResponseDecoder
