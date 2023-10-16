
function getVersion() {
    //get version from package.json
    const packageJson = require('../../package.json');
    return packageJson.version;
}

export default getVersion;