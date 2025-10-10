// Character Sheet Modal Functionality
class CharacterSheetModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // Create modal HTML structure
        const modalHTML = `
            <div class="character-sheet-modal" id="character-sheet-modal">
                <div class="modal-content">
                    <button class="close-btn" aria-label="Close modal">&times;</button>
                    <div class="character-sheet" data-accent="#7a3b9a" aria-label="Team character sheet: Ava Devlin">
                        <header>
                            <div class="banner" role="group" aria-label="Info banner">
                                <div class="kv-container">
                                    <div class="kv"><div class="k">Name</div><div class="v">Ava Devlin</div></div>
                                    <div class="kv"><div class="k">Class</div><div class="v">Engineer (Gameplay)</div></div>
                                    <div class="kv"><div class="k">Vibe</div><div class="v">Lawful Good</div></div>
                                </div>
                            </div>
                        </header>

                        <section class="body">
                            <aside class="side-section">
                                <div class="avatar" aria-hidden="true">
                                    <span>Portrait 200×200</span>
                                </div>
                                <div class="abilities" role="list" aria-label="Core abilities">
                                    <div class="box" role="listitem"><span class="label">Design</span><div class="score">12</div></div>
                                    <div class="box"><span class="label">Rules</span><div class="score">15</div></div>
                                    <div class="box"><span class="label">Writing</span><div class="score">14</div></div>
                                    <div class="box"><span class="label">Art</span><div class="score">10</div></div>
                                    <div class="box"><span class="label">Tech</span><div class="score">18</div></div>
                                    <div class="box"><span class="label">Playtesting</span><div class="score">16</div></div>
                                </div>
                            </aside>

                            <main>
                                <div class="panel">
                                    <h2 class="mb-1">Backstory</h2>
                                    <p>Ava cut her teeth hacking together RPG systems for weekend one-shots and building tiny tools to speed up encounter prep. After a detour into real-time rendering, she returned to tabletop with a focus on crunchy-but-kind mechanics—rules that invite clever play without slowing the table. She pairs a love of combat timing with a soft spot for cozy downtime scenes, and she's happiest when spreadsheets and stories shake hands. When playtests stall, Ava breaks the deadlock with quick prototypes, clear notes, and an endless stash of dice. Outside of work, she's a worldbuilder of small, believable tow.</p>
                                </div>

                                <div class="grid-two">
                                    <div class="panel">
                                        <h2>Traits</h2>
                                        <ul class="list">
                                            <li><strong>Advantage:</strong> Reads legacy rules like ancient runes.</li>
                                            <li><strong>Feat:</strong> One-Page Refactor — simplifies a subsystem without losing depth.</li>
                                            <li><strong>Quirk:</strong> Names internal tools after boss mechanics.</li>
                                        </ul>
                                    </div>
                                    <div class="panel">
                                        <h2>Proficiencies</h2>
                                        <ul class="list">
                                            <li>Action economy, status effects, encounter pacing</li>
                                            <li>Balancing tables, progression curves, probability tuning</li>
                                            <li>Session zero frameworks & playtest facilitation</li>
                                        </ul>
                                    </div>
                                </div>
                            </main>
                        </section>
                        
                        <div class="panel current-quest">
                            <h2>Current Quest</h2>
                            <ul class="list">
                                <li>Lock the dodge/counter timing for the core moveset</li>
                                <li>Draft a modular affix system for items & foes</li>
                                <li>Trim resolution steps to keep turns under 60 seconds</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('character-sheet-modal');
    }

    bindEvents() {
        // Close button event
        const closeBtn = this.modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.close());

        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent body scroll when modal is open
        this.modal.addEventListener('transitionend', () => {
            if (this.isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
            this.isOpen = true;
            
            // Focus management for accessibility
            const closeBtn = this.modal.querySelector('.close-btn');
            closeBtn.focus();
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    // Method to update character data (for future use)
    updateCharacterData(characterData) {
        // This can be expanded to dynamically update the character sheet content
        console.log('Character data updated:', characterData);
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.characterSheetModal = new CharacterSheetModal();
});

// Function to open character sheet (can be called from anywhere)
function openCharacterSheet() {
    if (window.characterSheetModal) {
        window.characterSheetModal.open();
    }
}
