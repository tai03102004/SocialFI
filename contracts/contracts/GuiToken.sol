// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GUIToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 1e18; // 1 billion tokens

    mapping(address => bool) public minters;

    event MinterAdded(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);

    constructor()
        ERC20("GameFi Universal Interface", "GUI")
        Ownable(msg.sender)
    {
        // Mint initial supply to owner for testing
        _mint(msg.sender, 100000000 * 1e18); // 100 million initial supply
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function mint(address to, uint256 amount) external {
        require(
            minters[msg.sender] || msg.sender == owner(),
            "Not authorized to mint"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Simple function for testing cross-chain transfers
    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        return super.transfer(to, amount);
    }
}
