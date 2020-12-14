/*! https://github.com/defunctzombie/node-stackback/blob/master/index.js */

import { formatStackTrace } from './format';

export function stackback(error: any): any {
	const save = Error.prepareStackTrace;

	Error.prepareStackTrace = function(err: any, trace: any): any {
		Object.defineProperty(err, '_sb_callsites', { value: trace });

		/* istanbul ignore next */
		return (save || formatStackTrace)(err, trace);
	};

	error.stack;

	/* istanbul ignore next */
	if (!error._sb_callsites) {
		return [];
	}

	Error.prepareStackTrace = save;

	return error._sb_callsites;
}
