/* eslint-disable import/no-unresolved */
const config = require('config');
/* eslint-enable import/no-unresolved */

const projectName = process.env.PROJECT_NAME;
const domain = projectName + '.ru';

module.exports = {
    MAIN_DOMAIN: domain,
    MIRROR_DOMAIN: 'www.' + domain,
    PROXY_HOST: config.server.host,
    PROXY_PORT: config.server.port,
    PROJECT_NAME: projectName,
};
