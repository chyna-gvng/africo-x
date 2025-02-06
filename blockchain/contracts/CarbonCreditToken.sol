// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProjectRegistration.sol";

/**
 * @title CarbonCreditToken (CCT)
 * @dev ERC-20 token representing carbon credits (1 CCT = 1 metric ton of CO2).
 * Implements role-based access control, minting, burning, depletion rate management, and CCT transfers.
 */
contract CarbonCreditToken is ERC20, Ownable {
    enum Role {None, Admin, ProjectOwner, Buyer}

    mapping(address => Role) public roles;
    mapping(address => uint256) public depletionRate;

    ProjectRegistration public projectReg;

    /**
     * @notice Initializes the ERC-20 Carbon Credit Token.
     */
    constructor() ERC20("CarbonCreditToken", "CCT") Ownable(msg.sender) {
        roles[msg.sender] = Role.Admin; // Set deployer as Admin
    }

    function setProjectRegistration(address _projectReg) external onlyOwner {
    	projectReg = ProjectRegistration(_projectReg);
    }

    /**
     * @notice Assigns a role to a user.
     * @param user Address of the user.
     * @param role The role to assign (1 = Admin, 2 = ProjectOwner, 3 = Buyer).
     */
    function setRole(address user, Role role) external onlyOwner {
        roles[user] = role;
        if (role == Role.Buyer && address(projectReg) != address(0)) {
        	projectReg.addEligibleVoter(user);
        }
    }

    /**
     * @notice Returns the role of a user.
     * @param user Address of the user.
     * @return The user's role.
     */
    function getRole(address user) external view returns (Role) {
        return roles[user];
    }

    /**
     * @notice Mints new CCT tokens.
     * @param account Address to receive tokens.
     * @param amount Amount of tokens to mint.
     */
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    /**
     * @notice Burns (retires) CCT tokens.
     * @param amount Amount of tokens to burn.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Sets the depletion rate for a buyer.
     * @param buyer The buyer's address.
     * @param rate The depletion rate (tokens per period).
     */
    function setDepletionRate(address buyer, uint256 rate) external onlyOwner {
        depletionRate[buyer] = rate;
    }

    /**
     * @notice Transfers CCT tokens from one address to another.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param amount The amount of tokens to transfer.
     */
    function transferFrom(address from, address to, uint256 amount) external override {
        require(roles[from] == Role.Buyer, "Only buyers can transfer CCT");
        super.transferFrom(from, to, amount);
    }
}
