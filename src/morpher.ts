import { CyrillicMorperSettings } from './settings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws3Morpher = require('morpher-ws3-client');

interface Morpher {
	generateCases(string: string): Promise<string[]>;
}

export class CyrillicMorpher implements Morpher {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	morpher: any;

	constructor(settings: CyrillicMorperSettings) {
		this.morpher = new ws3Morpher({
			token: settings.morpherApiKey,
		});
	}

	async generateCases(string: string, plural = false): Promise<string[]> {
		const result = await this.morpher.russian.declension(string);
		// TODO: move to settings
		const cases = [
			'accusative',
			'dative',
			'genitive',
			'instrumental',
			'prepositional',
		];
		let aliases = cases.map((caseName) => {
			return result[caseName];
		});
		if (plural) {
			aliases = aliases.concat(
				cases.map((caseName) => {
					return result['plural'][caseName];
				})
			);
		}
		return aliases;
	}
}
