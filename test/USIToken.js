const USIToken = artifacts.require('USIToken');
const { expectRevert, time } = require('@openzeppelin/test-helpers');

require('@openzeppelin/test-helpers/configure')({
  // provider: 'http://127.0.0.1:7545',
});

contract('USIToken Test', (accounts) => {
  const decimal = 10 ** 18;
  const initialSupply = 10000 * decimal;
  const transferAmount = 500 * decimal;

  const [owner, user] = accounts;

  it('should deploy and mint tokens to the deployer account', async () => {
    const usiToken = await USIToken.deployed();
    const balance = await usiToken.balanceOf.call(owner);
    assert.equal(balance.valueOf(), initialSupply, 'Not enough token in the first account');
  });

  it('should not able to transfer tokens before _startTime', async () => {
    const usiToken = await USIToken.deployed();

    await expectRevert(usiToken.transfer(user, `${transferAmount}`), 'Not available to transfer at this time!');
  });

  it('should able to transfer tokens after _startTime and before _endTime', async () => {
    const usiToken = await USIToken.deployed();

    await time.increase(time.duration.days(15));

    await usiToken.transfer(user, `${transferAmount}`);

    const balanceA = await usiToken.balanceOf.call(owner);
    const balanceB = await usiToken.balanceOf.call(user);

    assert.equal(balanceA.valueOf(), initialSupply - transferAmount, 'Not required amount in account A');
    assert.equal(balanceB.valueOf(), transferAmount, 'Not required amount in account B');
  });

  it('should not able to transfer tokens after _endTime', async () => {
    const usiToken = await USIToken.deployed();

    await time.increase(time.duration.days(10));

    await expectRevert(usiToken.transfer(user, `${transferAmount}`), 'Not available to transfer at this time!');
  });
});
