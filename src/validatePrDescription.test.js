const validatePrDescription = require('./validatePrDescription');

describe('non-visible changes PR', () => {
    it('requires visible change marker', async () => {
        await expect(validatePrDescription('I ignored the template')).rejects.toThrow(
            "PR description must answer prompt about visibility to end-users with 'yes' or 'no'"
        );
    });
    
    it('allows non-visible changes', async () => {
        validatePrDescription('changes are visible to end-users: no');
    });    
});

describe('visible changes PR', () => {
    it('allows visible changes', async () => {
        await validatePrDescription(`
            changes are visible to end-users: yes
            Searched for relevant documentation and updated as needed: yes
            Breaking change: no
            release notes appear below:
               here are my release notes!
        `);
    });
    it('allows the "yes" to remain on release notes line', async () => {
        await validatePrDescription(`
            changes are visible to end-users: yes
            Searched for relevant documentation and updated as needed: yes
            Breaking change: no
            release notes appear below: yes
               here are my release notes!
        `);
    });
    it('requires prompts for visible changes', async () => {
        await expect(validatePrDescription('changes are visible to end-users: yes')).rejects.toThrow(`\
PR description must answer 'updated documentation' prompt with 'yes' or 'no'
PR description must answer 'breaking changes' prompt with 'yes' or 'no'
PR description must answer 'release notes' prompt`
        );
        await expect(validatePrDescription(`
            changes are visible to end-users: yes
            relevant documentation was updated: yes
        `)).rejects.toThrow(
            "PR description must answer 'breaking changes' prompt with 'yes' or 'no'"
        );
        await expect(validatePrDescription(`
            changes are visible to end-users: yes
            relevant documentation was updated: yes
            breaking change: no
        `)).rejects.toThrow(
            "PR description must answer 'release notes' prompt"
        );
        await expect(validatePrDescription(`
            changes are visible to end-users: yes
            relevant documentation was updated: no
            breaking change: no
            Suggested release notes appear below: yes/no
        `)).rejects.toThrow(
            "PR description must answer 'release notes' prompt"
        );
    });
});

