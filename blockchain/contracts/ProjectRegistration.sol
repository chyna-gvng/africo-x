// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CarbonCreditToken.sol";
import "truffle/console.sol";

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
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public projectCount;

    // Track eligible voters
    mapping(address => bool) public eligibleVoters;
    address[] public voterList;

    event ProjectSubmitted(uint256 indexed projectId, string name, address owner);
    event VoteCast(uint256 indexed projectId, address voter, uint256 weight);
    event VoterAdded(address voter);
    event ProjectRegistered(uint256 indexed projectId);

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
     * @param _userAddress The address of the user submitting the project.
     */
    function submitProject(string calldata _name, address _userAddress) external {
        CarbonCreditToken.Role role = cct.getRole(_userAddress);
        require(role == CarbonCreditToken.Role.ProjectOwner, "Only project owners can submit projects");
        projects[projectCount] = Project(_name, _userAddress, 0, false);
        emit ProjectSubmitted(projectCount, _name, _userAddress);
        projectCount++;
    }

    /**
     * @notice Adds an address to the list of eligible voters when they receive the buyer role.
     * @param voter Address to be added as an eligible voter.
     */
    function addEligibleVoter(address voter) external {
        require(msg.sender == address(cct), "Only CCT contract can add voters");
        console.log("Attempting to add voter:", voter);
        console.log("eligibleVoters[voter] before:", eligibleVoters[voter]);
        console.log("cct.roles(voter):", uint256(cct.roles(voter)));
        require(!eligibleVoters[voter], "Already eligible");
        require(uint256(cct.roles(voter)) == 3, "Must be a buyer");

        eligibleVoters[voter] = true;
        voterList.push(voter);
        emit VoterAdded(voter);
    }

    /**
     * @notice Allows CCT holders to vote for a project.
     * @param projectId ID of the project to vote for.
     * @param voterAddress Address of the voter.
     */
    function voteForProject(uint256 projectId, address voterAddress) external {
        require(eligibleVoters[voterAddress], "Not an eligible voter");
        require(projectId < projectCount, "Invalid project ID");
        require(!hasVoted[projectId][voterAddress], "Already voted");

        uint256 voterBalance = cct.balanceOf(voterAddress);
        require(voterBalance > 0, "Must hold CCT to vote");

        projects[projectId].voteWeight += voterBalance;
        hasVoted[projectId][voterAddress] = true;
        emit VoteCast(projectId, voterAddress, voterBalance);
    }

    /**
     * @notice Finalizes project registration if it has >50% of total vote weight.
     * @param projectId ID of the project to finalize.
     */
    function finalizeProject(uint256 projectId) external {
        require(projectId < projectCount, "Invalid project ID");
        Project storage project = projects[projectId];

        require(!project.registered, "Already registered");

        uint256 requiredVotes = getTotalEligibleVotes() / 2;
        require(project.voteWeight > requiredVotes, "Not enough votes");

        project.registered = true;
        emit ProjectRegistered(projectId);
    }

    /**
     * @notice Calculates the total voting power of all eligible voters.
     * @return Total number of tokens held by eligible voters.
     */
    function getTotalEligibleVotes() public view returns (uint256) {
        uint256 totalVotes = 0;
        for (uint i = 0; i < voterList.length; i++) {
            totalVotes += cct.balanceOf(voterList[i]);
        }
        return totalVotes;
    }

    /**
     * @notice Gets the number of eligible voters.
     * @return Number of eligible voters.
     */
    function getEligibleVoterCount() external view returns (uint256) {
        return voterList.length;
    }

    /**
     * @notice Checks if an address is an eligible voter.
     * @param voter Address to check.
     * @return Whether the address is an eligible voter.
     */
    function isEligibleVoter(address voter) external view returns (bool) {
        return eligibleVoters[voter];
    }

    /**
     * @notice Gets whether an address has voted for a project.
     * @param projectId Project ID to check.
     * @param voter Address to check.
     * @return Whether the address has voted for the project.
     */
    function hasAddressVoted(uint256 projectId, address voter) external view returns (bool) {
        return hasVoted[projectId][voter];
    }
}
