// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    // Event to be emitted on coin flip
    event CoinFlipped(address indexed player, bool guess, bool result, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool _guess) public payable returns (bool) {
        require(msg.value > 0, "You need to send some Ether");

        uint256 result = block.timestamp % 2; // Simple coin flip: 0 or 1
        bool win = (_guess == (result == 0));

        if (win) {
            payable(msg.sender).transfer(msg.value * 2); // Double the bet if the user wins
        }

        // Emit the event after flipping the coin
        emit CoinFlipped(msg.sender, _guess, win, msg.value);

        return win;
    }

    // Fallback function to accept Ether directly to the contract
    fallback() external payable {}
    receive() external payable {}
}
