// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GUIToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 1e18; // 1 billion tokens

    mapping(address => bool) public minters;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor()
        ERC20("GameFi Universal Interface", "GUI")
        Ownable(msg.sender)
    {
        // Mint initial supply to owner

        _mint(msg.sender, 100000000 * 1e18); // 100 million initial supply
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized to mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
