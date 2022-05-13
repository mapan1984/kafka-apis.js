const ResponseDecoder = require('../base/response')

class MetadataResponseDecoder extends ResponseDecoder {
    constructor() {
        super()
        this.response = {
            brokerNum: null,
            hosts: [],
            topics: [],
        }
    }

    decode() {
        let _response = super.decode()

        this.response = {..._response, ...this.response}

        // 获取全部 broker 信息
        let brokerNum = this.readIntBE(4)  // 数组长度 int32
        this.response['brokerNum'] = brokerNum
        console.log(`brokerNum: ${brokerNum}`)

        for (let i = 0; i < brokerNum; i++) {
            let nodeId = this.readIntBE(4)
            let hostLen = this.readIntBE(2)
            let hostIP = this.readString(hostLen)
            let port = this.readIntBE(4)
            console.log(`nodeId: ${nodeId}, hostLen: ${hostLen}, hostIP: ${hostIP}, port: ${port}`)

            this.response.hosts.push({
                nodeId: nodeId,
                hostIP: hostIP,
                port: port,
            })
        }

        // 获取全部 topic 信息
        let topicNum = this.readIntBE(4)  // 数组长度 int32
        this.response['topicNum'] = topicNum
        console.log(`topicNum: ${topicNum}`)

        for (let j = 0; j < topicNum; j++) {

            let topicErrorCode = this.readIntBE(2)
            let topicNameLen = this.readIntBE(2)
            let topicName = this.readString(topicNameLen)

            let topic = {
                topicErrorCode: topicErrorCode,
                topicName: topicName,
                partitions: [],
            }

            // 分区数量
            let partitionNum = this.readIntBE(4)  // 数组长度 int32
            topic['partitionNum'] = partitionNum

            for (let k = 0; k < partitionNum; k++) {
                let partitionErrorCode = this.readIntBE(2)
                let partitionId = this.readIntBE(4)
                let leader = this.readIntBE(4)

                let partition = {
                    partitionErrorCode: partitionErrorCode,
                    partitionId: partitionId,
                    leader: leader,
                    replics: [],
                    isr: [],
                }

                let replicaNum = this.readIntBE(4)  // 数组长度 int32
                for (let l = 0; l < replicaNum; l++) {
                    let replic = this.readIntBE(4)
                    partition.replics.push(replic)
                }

                let isrNum = this.readIntBE(4)  // 数组长度 int32
                for (let l = 0; l < isrNum; l++) {
                    let isr = this.readIntBE(4)
                    partition.isr.push(isr)
                }

                topic.partitions.push(partition)
            }

            this.response['topics'].push(topic)
        }

        return this.response
    }
}

module.exports = MetadataResponseDecoder
