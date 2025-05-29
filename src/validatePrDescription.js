const core = require('@actions/core');

module.exports = async function validatePrDescription(prDescription) {
    if (!prDescription) {
        raiseError("PR description may not be empty");
    }
    const visibleChange = prDescription.match(/visible to end-users:\s+(yes|no)/i);
    if (!visibleChange) {
        raiseError("PR description must answer prompt about visibility to end-users with 'yes' or 'no'");
    }
    if (visibleChange[1] === 'no') {
        return;
    }
    const errors = [];
    if (!prDescription.match(/relevant documentation.*updated.*:\s+(yes|no)/i)) {
        errors.push("PR description must answer 'updated documentation' prompt with 'yes' or 'no'");
    }
    if (!prDescription.match(/Breaking change.*:\s+(yes|no)/i)) {
        errors.push("PR description must answer 'breaking changes' prompt with 'yes' or 'no'");
    }
    if (!prDescription.match(/release notes appear below:\s*(yes)?$/mi)) {
        errors.push("PR description must answer 'release notes' prompt");
    }
    if (errors.length > 0) {
        raiseError(errors.join("\n"));
    }
    function raiseError(message) {
        core.setOutput('error_message', message);
        throw new Error(message);
    }
}
