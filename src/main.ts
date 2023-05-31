import { Plugin, Editor, MarkdownView, MarkdownFileInfo } from 'obsidian';
import { CyrillicGenerator } from './aliasater';
import { CyrillicMorperSettings } from './settings';
import { CyrillicMorperSettingTab } from './settings_tab';

// Remember to rename these classes and interfaces!
const DEFAULT_SETTINGS: CyrillicMorperSettings = {
	morpherApiKey: null,
};

export default class ObsidianCyrillicMorper extends Plugin {
	settings: CyrillicMorperSettings;

	async onload() {
		await this.loadSettings();

		const generator = new CyrillicGenerator(this.app, this.settings);

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'cirillic-morper-generate-aliases-filename',
			name: 'Generate aliases based on filename',
			editorCallback: (
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			) => {
				generator.writeCyrillicCases(ctx);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CyrillicMorperSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
