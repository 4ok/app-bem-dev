const DEFAULT_TOP_DOMAIN = 'ru';
const MIRROR_DOMAIN_PROLOG = 'www';

module.exports = (config) => {
    const {
        projectName,
        server,
    } = config;

    const topDomain = config.topDomain || DEFAULT_TOP_DOMAIN;
    const domain = projectName + '.' + topDomain;

    return {
        MAIN_DOMAIN: domain,
        MIRROR_DOMAIN: MIRROR_DOMAIN_PROLOG + '.' + domain,
        PROXY_HOST: server.host,
        PROXY_PORT: server.port,
        PROJECT_NAME: projectName,
    };
};
