const net = require('net')

const DataBuffer = require('./data-buffer')

class Client {
    constructor(host, port) {
        this._correlationId = 0
        this.socket = null

        this.host = host
        this.port = port

        this.cbqueue = {}

        this.dataBuf = new DataBuffer()
    }

    connect() {
        this.socket = net.createConnection(this.port, this.host)

        this.socket.on("connect", () => {
            console.log(`connect to ${this.host}:${this.port} done.`)
        })

        this.socket.on("error", error => {
            console.error(`client socket to ${this.host}:${this.port} error: `, error)
        })

        this.socket.on("close", hadError => {
            if (hadError) {
                console.error(`client socket to ${this.host}:${this.port} close due to error.`)
            } else {
                console.log(`client socket to ${this.host}:${this.port} close.`)
            }
        })

        this.socket.on("end", () => {
            console.log(`client socket to ${this.host}:${this.port} end connection.`)
        })

        this.socket.on("timeout", () => {
            console.log(`client socket to ${this.host}:${this.port} timeout.`)
        })

        this.socket.on("data", data => {
            let end = this.dataBuf.update(data)
            while (end) {
                end = this.dataBuf.update()
            }
        })

        this.dataBuf.on("responseEnd", response => {
            this.handleResponse(response)
        })
    }

    handleResponse(response) {
        let size = response.readIntBE(0, 4)
        let correlationId = response.readIntBE(4, 4)
        console.log(`response size: ${size}, correlationId: ${correlationId}`)

        let handler = this.cbqueue[correlationId]
        let res = handler.decoder.decode(response)
        handler.callback(res)
    }

    nextCorrelationId() {
        // int32: -2147483648 ~ 2147483647
        if (this._correlationId >= 2147483647) {
            this._correlationId = 0
        }
        return this._correlationId++;
    }

    send(request, decoder, callback) {
        let correlationId = request.correlationId

        this.cbqueue[correlationId] = {
            decoder: decoder,
            callback: callback,
        }

        this.socket.write(request.data)
    }
}

module.exports = Client
