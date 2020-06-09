import SerialPort from 'serialport'

const DullParser = (SerialPort).parsers.ByteLength

class Serials {
    private opened: SerialPort[];

    constructor() {
        this.opened = []
    }

    async getPorts() {
        const list = await SerialPort.list()
        return list.filter(port => port.pnpId != null)
    }

    async connect(path: string, options?: SerialPort.OpenOptions) {
        const list = await this.getPorts()
        const port = list.find(port => port.path == path)
        if (port == null) {
            throw new Error('Port not found')
        }
        const opts: SerialPort.OpenOptions = Object.assign({
            baudRate: 9600,
            parity: 'none',
            stopBits: 1,
        }, options, {
            autoOpen: false
        })
        const serialport = new SerialPort(port.path, opts);
        return new Promise(resolve => {
            serialport.on('close', (error) => {
                console.log('closing!', error)
                this.opened.splice(this.opened.findIndex(i => i == serialport), 1);
            })
            serialport.open((err) => {
                if (err) {
                    console.error('ERROR: ', err)
                    Promise.reject(new Error());
                }
                const parser = new DullParser({length: 1});
                serialport.pipe(parser)
                this.opened.push(serialport)
                resolve(serialport)
            })

        })
    }

    reconfigure(path: string, options: SerialPort.UpdateOptions) {
        const port = this.opened.find(i => i.path == path)
        if (port == null) {
            throw new Error('Port not found or not opened')
        }
        port.binding.update(options)
    }

}

const instance = new Serials();

export default instance;
