const EnbConfig = require('./components/config');

module.exports = (config) => {
    const enbConfig = new EnbConfig(config);

    config.init = enbConfig.init.bind(enbConfig);
};
