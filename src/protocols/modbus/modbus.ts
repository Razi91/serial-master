import crc from 'crc'

const MEMORY_SIZE = 10000

function validCrc(command: Buffer) {
    if (command.length < 8) {
        return false;
    }
    const data = command.subarray(0, -2)
    const valid = crc.crc16modbus(data)
    const received = command.readUInt16LE(command.length - 2)
    return received == valid
}

export default class Modbus {
    id: number;
    memoryCoil: Buffer; // rw binary
    memoryDiscrete: Buffer; // r binary
    memoryInput: Buffer; // r int
    memoryHolding: Buffer; // rw int

    constructor(id = 1) {
        this.id = id;
        this.memoryCoil = Buffer.alloc(MEMORY_SIZE, 0)
        this.memoryDiscrete = Buffer.alloc(MEMORY_SIZE, 0)
        this.memoryInput = Buffer.alloc(MEMORY_SIZE * 2, 0)
        this.memoryHolding = Buffer.alloc(MEMORY_SIZE * 2, 0)
    }

    readCoils(offset: number, count: number): number[] {
        return [...this.memoryCoil.subarray(offset, offset + count)]
    }

    writeCoils(offset: number, values: Array<number | boolean>) {
        values.forEach((val, i) => this.memoryCoil.writeUInt8(val != 0 ? 1 : 0, offset + i * 2))
    }

    readDiscrete(offset: number, count: number): number[] {
        return [...this.memoryDiscrete.subarray(offset, offset + count)]
    }

    writeDiscrete(offset: number, values: number[]) {
        values.forEach((val, i) => this.memoryDiscrete.writeUInt8(val != 0 ? 1 : 0, offset + i * 2))
    }

    readInput(offset: number, count: number): number[] {
        return Array.from({length: count})
            .map((_, i) => this.memoryInput.readUInt16BE(offset + i * 2))
    }

    writeInput(offset: number, values: number[]) {
        values.forEach((val, i) => this.memoryInput.writeUInt16BE(val, offset + i * 2))
    }

    readHolding(offset: number, count: number): number[] {
        return Array.from({length: count})
            .map((_, i) => this.memoryHolding.readUInt16BE(offset * 2 + i * 2))
    }

    writeHolding(offset: number, values: number[]) {
        values.forEach((val, i) => this.memoryHolding.writeUInt16BE(val, offset * 2 + i * 2))
    }

    parseCommand(command: Buffer): number[] {
        if (!validCrc(command)) {
            throw new Error('Invalid CRC')
        }
        const fn = command.readUInt8(1);
        const offset = command.readUInt16BE(2) - 1;
        const count = command.readUInt16BE(4);
        switch (fn) {
            case 0x01:
                return this.readCoils(offset, count)
            case 0x02:
                return this.readInput(offset, count)
            case 0x03:
                return this.readHolding(offset, count)
        }
        return []
    }
}
