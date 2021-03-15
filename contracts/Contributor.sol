// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Contributor is Context {
    using SafeMath for uint256;

    mapping(address => uint256) contribution;
    address[] contriutors;

    event Donate(address _payer, uint256 amount);

    function donate() external payable {
        uint256 amount = msg.value;

        require(amount > 0, "Can't contribute zero amount!");
        if (contribution[_msgSender()] == 0) {
            contriutors.push(_msgSender());
        }
        contribution[_msgSender()] = contribution[_msgSender()].add(amount);

        emit Donate(_msgSender(), amount);
    }

    function getDonationAmount(address _payer) external view returns (uint256) {
        return contribution[_payer];
    }
}
