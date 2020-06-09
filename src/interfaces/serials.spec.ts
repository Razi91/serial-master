/* eslint no-magic-numbers: "off" */
/* tslint:disable:no-implicit-dependencies no-magic-numbers */
import { expect } from 'chai';
import 'mocha';

import SerialPort from 'serialport'
import serials from './serials'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MockBinding = require('@serialport/binding-mock') as any

SerialPort.Binding = MockBinding;


describe('serials', () => {
    describe('mock', () => {
        beforeEach(() => {
            MockBinding.createPort('/dev/TEST', { echo: true, record: true })
            expect(true).to.equal(true)
        })
        it ('Connects to mock', async () => {
            await serials.connect('/dev/TEST')
        })
    })
})
