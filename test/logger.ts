export class Logger {
	private lines: Array<string>;

	error(...strings: Array<string>): void {
		this.lines.push(...strings);
	}

	getOutput(): string {
		return this.lines.join('\n');
	}

	getLines(): Array<string> {
		return [...this.lines];
	}

	constructor() {
		this.lines = [];
	}
}
