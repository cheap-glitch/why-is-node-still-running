import { whyIsNodeStillRunning } from '../src/index';

import { createServer } from 'net';
import { fetch } from 'fetch-h2';

import { Logger } from './logger';

test("log open handles #1", async () => { // {{{

	// Setup
	const logger = new Logger();
	const server = createServer();
	server.listen(0);

	// Action
	whyIsNodeStillRunning(logger);

	// Tests
	expect(logger.getLines().shift()).toMatch(/There are [3-9]\d* handle\(s\) keeping the process running/);
	expect(logger.getOutput()).toMatch('TCPSERVERWRAP');
	expect(logger.getOutput()).toMatch('TickObject');

	// Cleanup
	await server.close();

}); // }}}

test("log open handles #2", async () => { // {{{

	// Setup
	const logger  = new Logger();
	const request = fetch('https://www.google.com');

	// Action
	whyIsNodeStillRunning(logger);

	// Tests
	expect(logger.getLines().shift()).toMatch(/There are [3-9]\d* handle\(s\) keeping the process running/);
	expect(logger.getOutput()).toMatch('new Promise');
	expect(logger.getOutput()).toMatch('why-is-node-still-running');

	// Cleanup
	await (await request).text();

}); // }}}
