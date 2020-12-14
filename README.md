# 🏃 why-is-node-still-running

![License](https://badgen.net/github/license/cheap-glitch/why-is-node-still-running?color=green)
![Latest release](https://badgen.net/github/release/cheap-glitch/why-is-node-still-running?color=green)
[![Coverage status](https://coveralls.io/repos/github/cheap-glitch/why-is-node-still-running/badge.svg?branch=main)](https://coveralls.io/github/cheap-glitch/why-is-node-still-running?branch=main)

> This is a port of mafintosh' [why-is-node-running](https://github.com/mafintosh/why-is-node-running)
> module to TypeScript, with modernized syntax and no dependencies.

```javascript
const { whyIsNodeStillRunning } = require('why-is-node-still-running');
const { createServer } = require('net');

const server = createServer();
server.listen(0);

whyIsNodeStillRunning();
// There are 2 handle(s) keeping the process running
```

## Installation

```shell
npm i -D why-is-node-still-running
```

## Usage

**Always import this module first** so  that the asynchronous hook can be setup.
The hook  will log  to the console  by default,  but you can  provide it  with a
custom logger that implements `error()`.

### Example of usage with Jest

Sometimes Jest  complains that there  are asynchronous operations  still hanging
after the tests  have been completed. When the  `--detectOpenHandles` flag gives
no output, you can try using this module to help pinpoint the cause:

<!-- https://github.com/facebook/jest/issues/7287#issuecomment-648974271 -->
```javascript
import { whyIsNodeStillRunning } from 'why-is-node-still-running';

afterAll(async () => {
	// Do your actual cleanup here
	// [...]

	// Print the handles still opened
	await new Promise(resolve => setTimeout(() => {
		whyIsNodeStillRunning();
		resolve();
	}, 4000));
});
```

Don't forget to run Jest with `--useStderr` to show console output.

Alternatively, you can use this module to print some information about the stack
regularly while the tests are running (e.g. see [this comment](https://github.com/facebook/jest/issues/9473#issuecomment-675738694)).

## License

```text
Copyright (c) 2020-present, cheap glitch

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby  granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE  IS PROVIDED "AS IS"  AND THE AUTHOR DISCLAIMS  ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING  ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS.  IN NO  EVENT  SHALL THE  AUTHOR  BE LIABLE  FOR  ANY SPECIAL,  DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR  PROFITS, WHETHER IN AN ACTION OF  CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN  CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```
