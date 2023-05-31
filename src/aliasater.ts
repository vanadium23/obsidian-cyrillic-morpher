import { App, MarkdownFileInfo } from 'obsidian';
import { CyrillicMorpher } from './morpher';
import { CyrillicMorperSettings } from './settings';

interface CyrillicAliasater {
	writeCyrillicCases(ctx: MarkdownFileInfo): void;
}

function mergeAliases(
	newAliases: string[],
	currentAliases: string[] | undefined,
	alias: string | undefined
): string[] {
	const mergedAliases = newAliases;
	if (currentAliases) {
		for (const alias of currentAliases) {
			if (mergedAliases.includes(alias)) {
				continue;
			}
			mergedAliases.push(alias);
		}
	}
	if (alias) {
		if (mergedAliases.includes(alias)) {
			return mergedAliases;
		}
		mergedAliases.push(alias);
	}
	return mergedAliases;
}

export class CyrillicGenerator implements CyrillicAliasater {
	app: App;
	morpher: CyrillicMorpher;

	constructor(app: App, settings: CyrillicMorperSettings) {
		this.app = app;
		this.morpher = new CyrillicMorpher(settings);
	}

	async writeCyrillicCases(ctx: MarkdownFileInfo) {
		// get current file
		if (!ctx?.file) {
			console.log('No file in context');
			return;
		}
		const filename = ctx.file?.basename;
		const cases = await this.morpher.generateCases(filename);
		const newAliases = cases.filter((alias) => alias !== filename);
		// update frontmatter aliases
		await this.app.fileManager.processFrontMatter(ctx.file, (frontmatter) => {
			const mergedAliases = mergeAliases(
				newAliases,
				frontmatter.aliases,
				frontmatter.alias
			);
			frontmatter['aliases'] = mergedAliases;
			if (frontmatter['alias']) {
				delete frontmatter['alias'];
			}
		});
	}
}
