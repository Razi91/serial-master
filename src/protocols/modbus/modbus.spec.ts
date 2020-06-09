/* eslint no-magic-numbers: "off" */
/* tslint:disable:no-implicit-dependencies no-magic-numbers */

import {expect} from 'chai';
import 'mocha';
import Modbus from "./modbus";

describe('Modbus device', () => {
    describe('controller', () => {
        it('remembers coils', () => {
            const device = new Modbus()
            const offset = 150;
            expect(device.readCoils(offset, 1)[0]).to.equal(false);
            device.writeCoils(offset, [1])
            expect(device.readCoils(offset, 1)[0]).to.equal(true);
        })
        it('remembers discretes', () => {
            const device = new Modbus()
            const offset = 150;
            expect(device.readDiscrete(offset, 1)[0]).to.equal(false);
            device.writeDiscrete(offset, [1])
            expect(device.readDiscrete(offset, 1)[0]).to.equal(true);
        })
        it('remembers inputs', () => {
            const device = new Modbus()
            const offset = 150;
            const values = [0x4365, 0x6483];
            expect(device.readInput(offset, 1)[0]).to.equal(0);
            device.writeInput(offset, values)
            expect(device.readInput(offset, 2)).to.deep.equal(values);
        })
        it('remembers holdings', () => {
            const device = new Modbus()
            const offset = 150;
            const values = [0x4365, 0x6483];
            expect(device.readInput(offset, 1)[0]).to.equal(0);
            device.writeInput(offset, values)
            expect(device.readInput(offset, 2)).to.deep.equal(values);
        })
    })
    describe.only('parser', () => {
        it('throws on invalid crc', () => {
            const device = new Modbus()
            const command = Buffer.from([0x01, 0x03, 0x00, 0x01, 0x00, 0x0a, 0x00, 0x0d])
            expect(() => device.parseCommand(command)).to.throw();
        });
        it('parses command read holding registers', () => {
            const device = new Modbus()
            const command = Buffer.from([0x01, 0x03, 0x00, 0x01, 0x00, 0x0a, 0x94, 0x0d])
            device.writeHolding(5, [5]);
            const res = device.parseCommand(command)
            expect(res.length).to.equal(0x0a)
            expect(res[5]).to.equal(5)
        })
    })

})
