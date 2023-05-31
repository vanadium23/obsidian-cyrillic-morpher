import { PluginSettingTab, App, Setting } from 'obsidian';
import ObsidianCyrillicMorper from './main';

export class CyrillicMorperSettingTab extends PluginSettingTab {
	plugin: ObsidianCyrillicMorper;

	constructor(app: App, plugin: ObsidianCyrillicMorper) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', {
			text: 'Settings for obsidian cyrillic morpher.',
		});

		new Setting(containerEl)
			.setName('Morper API key')
			.setDesc('You can buy API at https://morpher.ru/ws3/buy/')
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.settings.morpherApiKey || '')
					.onChange(async (value) => {
						if (value === '') {
							this.plugin.settings.morpherApiKey = null;
						} else {
							this.plugin.settings.morpherApiKey = value;
						}
						await this.plugin.saveSettings();
					})
			);
	}
}
