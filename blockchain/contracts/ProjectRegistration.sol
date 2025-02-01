// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CarbonCreditToken.sol";

/**
 * @title ProjectRegistration
 * @dev Allows project owners to submit projects and receive verification through voting.
 */
contract ProjectRegistration {
    struct Project {
        string name;
        address owner;
        uint256 voteWeight;
        bool registered;
    }

    CarbonCreditToken public cct;
    address public admin;
    uint256 public totalVoteWeight;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public projectCount;

    /**
     * @notice Initializes the contract with the CarbonCreditToken address.
     * @param _cct Address of the CCT contract.
     */
    constructor(address _cct) {
        cct = CarbonCreditToken(_cct);
        admin = msg.sender;
    }

    /**
     * @notice Allows a project owner to submit a new project.
     * @param _name The name of the project.
     */
    function submitProject(string calldata _name) external {
        require(uint256(cct.roles(msg.sender)) == 2, "Only project owners can submit projects");
        projects[projectCount] = Project(_name, msg.sender, 0, false);
        projectCount++;
    }

    /**
     * @notice Allows CCT holders to vote for a project.
     * @param projectId ID of the project to vote for.
     */
    function voteForProject(uint256 projectId) external {
        require(uint256(cct.roles(msg.sender)) == 3, "Only buyers can vote");
        require(projectId < projectCount, "Invalid project ID");
        require(!hasVoted[projectId][msg.sender], "Already voted");

        uint256 voterBalance = cct.balanceOf(msg.sender);
        require(voterBalance > 0, "Must hold CCT to vote");

        projects[projectId].voteWeight += voterBalance;
        totalVoteWeight += voterBalance;
        hasVoted[projectId][msg.sender] = true;
    }

    /**
     * @notice Finalizes project registration if it has >50% of total vote weight.
     * @param projectId ID of the project to finalize.
     */
    function finalizeProject(uint256 projectId) external {
        require(projectId < projectCount, "Invalid project ID");
        Project storage project = projects[projectId];

        require(!project.registered, "Already registered");
        require(project.voteWeight > totalVoteWeight / 2, "Not enough votes");

        project.registered = true;
    }
}
