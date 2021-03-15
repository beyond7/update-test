const Contributor = artifacts.require('Contributor');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const truffleAssert = require('truffle-assertions');

require('@openzeppelin/test-helpers/configure')({
  // provider: 'http://127.0.0.1:7545',
});

contract('Distributor Test', (accounts) => {
  const decimal = 10 ** 18;
  const donationAmount = 1 * decimal;

  const [owner, user] = accounts;

  it('should able to donate', async () => {
    const contributor = await Contributor.deployed();
    const result = await contributor.donate({ value: donationAmount });

    const contractBalance = await web3.eth.getBalance(contributor.address);
    const contributedAmount = await contributor.getDonationAmount(owner);

    assert.equal(contractBalance, donationAmount, 'Not enough ETH on Contract!');
    assert.equal(contributedAmount, donationAmount, 'Not enough donation amount!');

    truffleAssert.eventEmitted(
      result,
      'Donate',
      (ev) => {
        return ev._payer === owner && ev.amount.toString(), donationAmount.toString();
      },
      'donate() should emit Donate event with correct params',
    );
  });
});
