// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Governance is Ownable {
    IERC20 public cctToken;
    ProjectRegistration public projectRegistration;

    constructor(address _cctToken, address _projectRegistration) {
        cctToken = IERC20(_cctToken);
        projectRegistration = ProjectRegistration(_projectRegistration);
    }

    function vote(uint256 projectId) external {
        uint256 voteWeight = cctToken.balanceOf(msg.sender);
        projectRegistration.voteForProject(projectId, voteWeight);
    }

    function retireCarbon(uint256 amount, uint256 depletionRate) external {
        require(depletionRate > 0 && depletionRate <= 100, "Depletion rate must be between 1 and 100");
        uint256 retireAmount = (amount * depletionRate) / 100;
        cctToken.transferFrom(msg.sender, address(this), retireAmount);
        cctToken.burn(retireAmount);
    }
}
