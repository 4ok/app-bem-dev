const EnbConfig = require('../../components/enbConfig');

module.exports = (config) => {
    const enbConfig = new EnbConfig(config);

    config.init = enbConfig.init.bind(enbConfig);
};
