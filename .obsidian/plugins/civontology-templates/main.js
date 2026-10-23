import { Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder, Modal } from 'obsidian';

// Default templates
const NOTE_TEMPLATE = `---
title: {{title}}
description: {{title}}
---

# {{title}}

`;

const SECTION_TEMPLATE = `---
title: {{title}}
description: {{title}} section
sidebar:
  label: "{{emoji}} {{title}}"  # Custom name with emoji
  order: {{order}}             # Sort order (1 = top)
  collapsed: false             # Start expanded (default)
---

# {{title}}

Welcome to the {{title}} section.
`;

const HIDDEN_TEMPLATE = `---
title: {{title}}
description: {{title}}
sidebar:
  hidden: true                 # Hidden from sidebar
---

# {{title}}

`;

export default class CivontologyTemplatesPlugin extends Plugin {
    
    async onload() {
        console.log('Loading Civontology Templates plugin');
        
        // Add command: Create Note with Template
        this.addCommand({
            id: 'create-civontology-note',
            name: 'Create Note with Template',
            callback: () => this.createNoteWithTemplate(),
        });
        
        // Add command: Create Section with Template
        this.addCommand({
            id: 'create-civontology-section',
            name: 'Create Section (Folder) with Template',
            callback: () => this.createSectionWithTemplate(),
        });
        
        // Add command: Create Hidden Note
        this.addCommand({
            id: 'create-hidden-note',
            name: 'Create Hidden Note (Draft)',
            callback: () => this.createHiddenNote(),
        });
        
        // Add command: Insert Note Template at cursor
        this.addCommand({
            id: 'insert-note-template',
            name: 'Insert Note Template',
            editorCallback: (editor) => {
                const title = this.getTitleFromSelection(editor) || 'New Note';
                const template = NOTE_TEMPLATE.replace(/{{title}}/g, title);
                editor.replaceSelection(template);
                new Notice('Note template inserted!');
            },
        });
        
        // Add command: Insert Section Template at cursor
        this.addCommand({
            id: 'insert-section-template',
            name: 'Insert Section Template',
            editorCallback: (editor) => {
                const title = this.getTitleFromSelection(editor) || 'New Section';
                const template = SECTION_TEMPLATE
                    .replace(/{{title}}/g, title)
                    .replace(/{{emoji}}/g, '📁')
                    .replace(/{{order}}/g, '1');
                editor.replaceSelection(template);
                new Notice('Section template inserted!');
            },
        });
        
        // Auto-add template to new notes in specific folders
        this.registerEvent(
            this.app.vault.on('create', async (file) => {
                if (file instanceof TFile && file.extension === 'md') {
                    await this.maybeAddTemplateToNewFile(file);
                }
            })
        );
        
        // Add ribbon icon
        this.addRibbonIcon('file-plus', 'New Civontology Note', () => {
            this.createNoteWithTemplate();
        });
        
        // Add settings tab
        this.addSettingTab(new CivontologyTemplatesSettingTab(this.app, this));
        
        new Notice('Civontology Templates loaded! Use the ribbon icon or commands to create notes.');
    }
    
    async maybeAddTemplateToNewFile(file) {
        // Check if file is empty and in a content folder
        const content = await this.app.vault.read(file);
        const path = file.path;
        
        // Skip if file already has content or frontmatter
        if (content.trim().length > 0) return;
        if (content.includes('---')) return;
        
        // Skip system folders
        const skipFolders = ['.obsidian', '.git', 'attachments', 'templates'];
        for (const folder of skipFolders) {
            if (path.startsWith(folder + '/')) return;
        }
        
        // Get title from filename
        const title = file.basename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Determine if this is a folder index (parent folder name)
        const parentFolder = file.parent?.name;
        const isIndex = file.basename.toLowerCase() === 'index';
        
        let template;
        if (isIndex && parentFolder) {
            // This is an index.md in a folder - use section template
            template = SECTION_TEMPLATE
                .replace(/{{title}}/g, parentFolder)
                .replace(/{{emoji}}/g, '📁')
                .replace(/{{order}}/g, '1');
        } else {
            // Regular note
            template = NOTE_TEMPLATE.replace(/{{title}}/g, title);
        }
        
        await this.app.vault.modify(file, template);
        new Notice(`Template added to: ${file.name}`);
    }
    
    getTitleFromSelection(editor) {
        const selection = editor.getSelection();
        if (selection && selection.length > 0 && selection.length < 100) {
            return selection.replace(/\n/g, ' ').trim();
        }
        return null;
    }
    
    async createNoteWithTemplate() {
        const folder = this.app.vault.getAbstractFileByPath('');
        const file = await this.app.vault.create(
            `New Note ${Date.now()}.md`,
            NOTE_TEMPLATE.replace(/{{title}}/g, 'New Note')
        );
        await this.app.window.openLeaf().setViewState({
            state: { mode: 'source', file: file.path },
        });
        new Notice('Note created with template!');
    }
    
    async createSectionWithTemplate() {
        const modal = new SectionModal(this.app, async (title, emoji, order) => {
            const folderPath = title;
            const folder = await this.app.vault.createFolder(folderPath).catch(() => 
                this.app.vault.getAbstractFileByPath(folderPath)
            );
            
            const indexFile = await this.app.vault.create(
                `${folderPath}/index.md`,
                SECTION_TEMPLATE
                    .replace(/{{title}}/g, title)
                    .replace(/{{emoji}}/g, emoji)
                    .replace(/{{order}}/g, order)
            );
            
            await this.app.window.openLeaf().setViewState({
                state: { mode: 'source', file: indexFile.path },
            });
            
            new Notice(`Section "${title}" created with template!`);
        });
        modal.open();
    }
    
    async createHiddenNote() {
        const file = await this.app.vault.create(
            `Draft ${Date.now()}.md`,
            HIDDEN_TEMPLATE.replace(/{{title}}/g, 'Draft Note')
        );
        await this.app.window.openLeaf().setViewState({
            state: { mode: 'source', file: file.path },
        });
        new Notice('Hidden note created (won\'t appear in sidebar)!');
    }
    
    onunload() {
        console.log('Unloading Civontology Templates plugin');
    }
}

// Modal for creating sections
class SectionModal extends Modal {
    constructor(app, callback) {
        super(app);
        this.callback = callback;
        this.title = '';
        this.emoji = '📁';
        this.order = '1';
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Create New Section' });
        
        new Setting(contentEl)
            .setName('Section name')
            .setDesc('Folder name (becomes sidebar section)')
            .addText(text => text
                .setPlaceholder('My Section')
                .onChange(value => this.title = value));
        
        new Setting(contentEl)
            .setName('Emoji')
            .setDesc('Emoji for sidebar label')
            .addText(text => text
                .setPlaceholder('📁')
                .setValue('📁')
                .onChange(value => this.emoji = value || '📁'));
        
        new Setting(contentEl)
            .setName('Order')
            .setDesc('Sort order (1 = top)')
            .addText(text => text
                .setPlaceholder('1')
                .setValue('1')
                .onChange(value => this.order = value || '1'));
        
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Create Section')
                .setCta()
                .onClick(() => {
                    if (this.title) {
                        this.callback(this.title, this.emoji, this.order);
                        this.close();
                    }
                }));
    }
    
    onClose() {
        this.contentEl.empty();
    }
}

// Settings tab
class CivontologyTemplatesSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display() {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'Civontology Templates Settings' });
        
        new Setting(containerEl)
            .setName('Auto-add templates')
            .setDesc('Automatically add frontmatter templates to new notes')
            .addToggle(toggle => toggle
                .setValue(true)
                .onChange(value => {
                    // Store setting
                }));
        
        containerEl.createEl('h3', { text: 'Available Commands' });
        containerEl.createEl('ul', {}, (ul) => {
            ul.createEl('li', { text: 'Create Note with Template - Adds note frontmatter' });
            ul.createEl('li', { text: 'Create Section with Template - Creates folder with index.md' });
            ul.createEl('li', { text: 'Create Hidden Note - Note hidden from sidebar' });
            ul.createEl('li', { text: 'Insert Note Template - Insert at cursor' });
            ul.createEl('li', { text: 'Insert Section Template - Insert at cursor' });
        });
        
        containerEl.createEl('h3', { text: 'Templates' });
        
        containerEl.createEl('h4', { text: 'Note Template' });
        containerEl.createEl('pre', { text: NOTE_TEMPLATE });
        
        containerEl.createEl('h4', { text: 'Section Template' });
        containerEl.createEl('pre', { text: SECTION_TEMPLATE });
        
        containerEl.createEl('h4', { text: 'Hidden Note Template' });
        containerEl.createEl('pre', { text: HIDDEN_TEMPLATE });
    }
}
