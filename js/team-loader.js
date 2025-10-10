// Team Members Loader
class TeamLoader {
    constructor() {
        this.teamMembers = [];
        this.container = document.getElementById('team-members-container');
        this.BASE_URL = 'https://eridan-studios.github.io/web-site/content/team/';
    }

    async loadTeamMembers() {
        try {
            // Load the team.json file to get the list of team member files
            const teamResponse = await fetch(`${this.BASE_URL}team.json`);
            if (!teamResponse.ok) {
                throw new Error(`Failed to load team.json: ${teamResponse.status}`);
            }
            
            const teamFiles = await teamResponse.json();
            
            // Load each team member's data
            const teamPromises = teamFiles.map(async (filename) => {
                try {
                    const memberResponse = await fetch(`${this.BASE_URL}${filename}`);
                    if (!memberResponse.ok) {
                        console.warn(`Failed to load ${filename}: ${memberResponse.status}`);
                        return null;
                    }
                    return await memberResponse.json();
                } catch (error) {
                    console.warn(`Error loading ${filename}:`, error);
                    return null;
                }
            });

            const members = await Promise.all(teamPromises);
            this.teamMembers = members.filter(member => member !== null);
            
            this.renderTeamMembers();
        } catch (error) {
            console.error('Error loading team members:', error);
            this.showError();
        }
    }

    renderTeamMembers() {
        if (!this.container) {
            console.error('Team members container not found');
            return;
        }

        this.container.innerHTML = '';

        this.teamMembers.forEach(member => {
            const memberElement = this.createMemberElement(member);
            this.container.appendChild(memberElement);
        });
    }

    createMemberElement(member) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member-circle';
        memberDiv.setAttribute('data-member-id', member.id);

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'team-member-avatar';

        const img = document.createElement('img');
        img.src = member.avatar;
        img.alt = member.name;
        img.onerror = () => {
            // Fallback to placeholder if image fails to load
            img.src = 'https://eridan-studios.github.io/web-site/content/images/placeholder-user.jpg';
        };

        avatarDiv.appendChild(img);

        const nameDiv = document.createElement('h3');
        nameDiv.className = 'team-member-name';
        nameDiv.textContent = member.name;

        const classDiv = document.createElement('p');
        classDiv.className = 'team-member-class';
        classDiv.textContent = member.class;

        memberDiv.appendChild(avatarDiv);
        memberDiv.appendChild(nameDiv);
        memberDiv.appendChild(classDiv);

        // Add click handler to avatar only
        avatarDiv.addEventListener('click', () => {
            this.handleMemberClick(member);
        });

        return memberDiv;
    }

    handleMemberClick(member) {
        // Open character sheet modal with member data
        if (window.characterSheetModal) {
            window.characterSheetModal.updateCharacterData(member);
            window.characterSheetModal.open();
        } else {
            console.error('Character sheet modal not available');
        }
    }

    showError() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: var(--text-secondary); font-size: 1.1rem;">
                    Unable to load team members. Please try refreshing the page.
                </p>
            </div>
        `;
    }
}

// Initialize team loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const teamLoader = new TeamLoader();
    teamLoader.loadTeamMembers();
});
