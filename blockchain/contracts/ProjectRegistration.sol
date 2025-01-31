// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectRegistration is Ownable {
    struct Project {
        string name;
        string description;
        address owner;
        uint256 voteWeight;
        bool registered;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectSubmitted(uint256 projectId, string name, string description, address owner);
    event ProjectRegistered(uint256 projectId);

    function submitProject(string memory name, string memory description) external {
        projects[projectCount] = Project(name, description, msg.sender, 0, false);
        emit ProjectSubmitted(projectCount, name, description, msg.sender);
        projectCount++;
    }

    function voteForProject(uint256 projectId, uint256 voteWeight) external {
        require(projectId < projectCount, "Invalid project ID");
        projects[projectId].voteWeight += voteWeight;

        if (projects[projectId].voteWeight > (totalSupply() / 2)) {
            projects[projectId].registered = true;
            emit ProjectRegistered(projectId);
        }
    }

    function getProject(uint256 projectId) external view returns (string memory name, string memory description, address owner, uint256 voteWeight, bool registered) {
        require(projectId < projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        return (project.name, project.description, project.owner, project.voteWeight, project.registered);
    }
}
