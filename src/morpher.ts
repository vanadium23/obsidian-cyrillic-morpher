import { CyrillicMorperSettings } from './settings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Morpher = require('morpher-ws3-client');

interface Morpher {
	generateCases(string: string): Promise<string[]>;
}

export class CyrillicMorpher implements Morpher {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	morpher: any;

	constructor(settings: CyrillicMorperSettings) {
		this.morpher = new Morpher({
			token: settings.morpherApiKey,
		});
	}

	async generateCases(string: string): Promise<string[]> {
		const result = await this.morpher.russian.declension(string);
		// TODO: move to settings
		const cases = [
			'accusative',
			'dative',
			'genitive',
			'instrumental',
			'prepositional',
		];
		const aliases = cases.map((caseName) => {
			return result[caseName];
		});
		return aliases;
	}
}
