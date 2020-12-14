/*!
 * why-is-node-still-running
 *
 * Find out exactly why Node is still running.
 *
 * Copyright (c) 2020-present, cheap glitch
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import { sep as pathSeparator } from 'path';
import { existsSync, readFileSync } from 'fs';
import { createHook } from 'async_hooks';

import { stackback } from './lib/stackback';

const active = new Map();

const hook = createHook({
	init(id: number, type: any, _: any, resource: any) {
		if (type == 'TIMERWRAP' || type == 'PROMISE') {
			return;
		}

		const error = new Error();
		const stacks = stackback(error);
		active.set(id, { type, stacks, resource });
	},
	destroy(id) {
		active.delete(id);
	},
});

hook.enable();

export function whyIsNodeRunning(logger: any = console): void {
	hook.disable();

	const activeResources = [...active.values()].filter(resource =>
		resource.type != 'Timeout'
		|| typeof resource.resource.hasRef != 'function'
		|| resource.resource.hasRef()
	);

	logger.error('There are %d handle(s) keeping the process running', activeResources.length);
	activeResources.forEach(resource => printStacks(logger, resource));
}

function printStacks(logger: any, resource: any): void {
	const stacks = resource.stacks.slice(1).filter((stack: any) => {
		const filename = stack.getFileName();

		return (filename && filename.includes(pathSeparator) && filename.indexOf('internal' + pathSeparator) != 0);
	});

	logger.error('\n# %s', resource.type);

	if (!stacks[0]) {
		logger.error('(unknown stack trace)');

		return;
	}

	const padding = ' '.repeat(Math.max(...stacks.map((stack: any) => (stack.getFileName() + ':' + stack.getLineNumber()).length)));

	for (const stack of stacks) {
		const prefix = stack.getFileName() + ':' + stack.getLineNumber();

		if (existsSync(stack.getFileName())) {
			const src = readFileSync(stack.getFileName(), 'utf8').split(/\n|\r\n/);
			logger.error(prefix + padding.slice(prefix.length) + ' - ' + src[stack.getLineNumber() - 1].trim());
		} else {
			logger.error(prefix + padding.slice(prefix.length));
		}
	}
}
