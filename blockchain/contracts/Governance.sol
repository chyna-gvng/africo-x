// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProjectRegistration.sol";

contract Governance is Ownable {
    ERC20Burnable public cctToken;
    ProjectRegistration public projectRegistration;

    constructor(address _cctToken, address _projectRegistration) Ownable(msg.sender) {
        cctToken = ERC20Burnable(_cctToken);
        projectRegistration = ProjectRegistration(_projectRegistration);
    }

    function vote(uint256 projectId) external {
        uint256 voteWeight = cctToken.balanceOf(msg.sender);
        uint256 totalSupply = cctToken.totalSupply();
        projectRegistration.voteForProject(projectId, voteWeight, totalSupply);
    }

    function retireCarbon(uint256 amount, uint256 depletionRate) external {
        require(depletionRate > 0 && depletionRate <= 100, "Depletion rate must be between 1 and 100");
        uint256 retireAmount = (amount * depletionRate) / 100;
        cctToken.transferFrom(msg.sender, address(this), retireAmount);
        cctToken.burn(retireAmount);
    }
}
