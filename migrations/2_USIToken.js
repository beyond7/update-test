const USIToken = artifacts.require('USIToken');
const moment = require('moment');

module.exports = function (deployer) {
  const initialSupply = 10000;

  deployer.deploy(
    USIToken,
    '10000000000000000000000',
    'USI Token',
    'USI',
    moment().add(10, 'days').unix(),
    moment().add(20, 'days').unix(),
  );
};
