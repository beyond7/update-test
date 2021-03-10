// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract USIToken is ERC20 {
    using SafeMath for uint256;

    uint256 _startTime;
    uint256 _endTime;

    constructor(
        uint256 initialSupply,
        string memory name,
        string memory symbol,
        uint256 startTime,
        uint256 endTime
    ) ERC20(name, symbol) {
        _startTime = startTime;
        _endTime = endTime;
        _mint(msg.sender, initialSupply);
    }

    modifier canTransfer {
        require(
            block.timestamp >= _startTime && block.timestamp <= _endTime,
            "Not available to transfer at this time!"
        );
        _;
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount)
        public
        override
        canTransfer
        returns (bool)
    {
        require(block.timestamp >= _startTime && block.timestamp <= _endTime);
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override canTransfer returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            allowance(sender, _msgSender()).sub(
                amount,
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;
    }
}
