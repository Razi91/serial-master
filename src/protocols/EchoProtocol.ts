import SerialPort from "serialport";
const ReadByte = SerialPort.parsers.ByteLength;

export default class EchoProtocol {
    constructor(port: SerialPort) {
        const echo = new ReadByte({length: 1});
        port.pipe(echo)
        echo.on('data', bytes => {
            port.write(bytes)
        })
    }
}
