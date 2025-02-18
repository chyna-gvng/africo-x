// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "truffle/console.sol";
import "./ProjectRegistration.sol";

/**
 * @title CarbonCreditToken (CCT)
 * @dev ERC-20 token representing carbon credits (1 CCT = 1 metric ton of CO2).
 * Implements role-based access control, minting, burning, depletion rate management, and CCT transfers.
 */
contract CarbonCreditToken is ERC20, Ownable {
    /// @dev Defines user roles within the system.
    enum Role {
        None,          // 0: No role assigned
        Admin,         // 1: Admin role
        ProjectOwner,  // 2: Project owner role
        Buyer          // 3: Buyer role
    }

    /// @notice Mapping of addresses to their assigned roles.
    mapping(address => Role) public roles;

    /// @notice Mapping of buyers to their depletion rate (CCT per period).
    mapping(address => uint256) public depletionRate;

    /// @notice Address of the ProjectRegistration contract.
    ProjectRegistration public projectReg;

    /// @notice Emitted when a new ProjectRegistration contract is set.
    event ProjectRegistrationUpdated(address indexed projectReg);

    /**
     * @notice Initializes the ERC-20 Carbon Credit Token.
     */
    constructor() ERC20("CarbonCreditToken", "CCT") Ownable(msg.sender) {
        roles[msg.sender] = Role.Admin; // Assign deployer as Admin
    }

    /**
     * @notice Sets the ProjectRegistration contract address.
     * @dev Only the owner can update this.
     * @param _projectReg The address of the new ProjectRegistration contract.
     */
    function setProjectRegistration(address _projectReg) external onlyOwner {
        require(_projectReg != address(0), "Invalid address");
        projectReg = ProjectRegistration(_projectReg);
        emit ProjectRegistrationUpdated(_projectReg);
    }

    /**
     * @notice Assigns a role to a user.
     * @dev Only the owner can assign roles.
     * @param user Address of the user.
     * @param role The role to assign (1 = Admin, 2 = ProjectOwner, 3 = Buyer).
     */
    function setRole(address user, Role role) external onlyOwner {
        console.log("setRole called for user:", user);
        console.log("Role being set:", uint256(role));
        roles[user] = role;

        // If the user is assigned as a Buyer, register them as an eligible voter
        if (role == Role.Buyer && address(projectReg) != address(0)) {
            console.log("projectReg address:", address(projectReg));
            console.log("Adding eligible voter:", user);
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
     * @dev Only the owner can mint tokens.
     * @param account Address to receive tokens.
     * @param amount Amount of tokens to mint.
     */
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    /**
     * @notice Burns (retires) CCT tokens.
     * @dev Users can burn their own tokens to retire carbon credits.
     * @param amount Amount of tokens to burn.
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Sets the depletion rate for a buyer.
     * @dev Only the owner can set the depletion rate.
     * @param buyer The buyer's address.
     * @param rate The depletion rate (tokens per period).
     */
    function setDepletionRate(address buyer, uint256 rate) external onlyOwner {
        depletionRate[buyer] = rate;
    }

    /**
     * @notice Transfers CCT tokens from the sender to another address.
     * @param to The address to transfer to.
     * @param amount The amount of tokens to transfer.
     * @return success True if the transfer succeeds.
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) public override returns (bool success) {
        require(roles[from] == Role.Buyer, "Only buyers can transfer CCT");
        return super.transferFrom(from, to, amount);
    }
}
