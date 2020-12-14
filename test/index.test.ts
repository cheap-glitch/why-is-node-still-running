import { whyIsNodeStillRunning } from '../src/index';

import { createServer } from 'net';
import { fetch, Response } from 'fetch-h2';

import { Logger } from './logger';

const server = createServer();
let response: Response;

// Cleanup the open resources
afterAll(async () => {
	await server.close();
	await response.text();
});

test("log open handles #1", () => { // {{{

	// Setup
	server.listen(0);
	const logger = new Logger();

	// Action
	whyIsNodeStillRunning(logger);

	// Tests
	expect(logger.getLines().shift()).toMatch(/There are \d+ handle\(s\) keeping the process running/);
	expect(logger.getOutput()).toMatch('TCPSERVERWRAP');
	expect(logger.getOutput()).toMatch('TickObject');

}); // }}}

test("log open handles #2", async () => { // {{{

	// Setup
	response = await fetch('https://www.google.com');
	const logger = new Logger();

	// Action
	whyIsNodeStillRunning(logger);

	// Tests
	expect(logger.getLines().shift()).toMatch(/There are \d+ handle\(s\) keeping the process running/);
	expect(logger.getOutput()).toMatch('new Promise');
	expect(logger.getOutput()).toMatch('why-is-node-still-running');

}); // }}}
