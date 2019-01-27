pragma solidity ^0.5.0;

/**
 * @title An Administrable contract
 * @author Martin Ernesto Barreyro (barreyromartin@gmail.com)
 */
contract Administrable {
    address private owner;
    address[] private admins;
    mapping(address => bool) public isAdmin;

    /**
     * Constructor of the contract
     * @param _admins addresses of accounts allowed to administrate the contract
     */
    constructor(address[] memory _admins) public {
        owner = msg.sender;
        for (uint i = 0; i < _admins.length; i++) {
            isAdmin[_admins[i]] = true;
        }

        isAdmin[msg.sender] = true;
        admins = _admins;
    }

    /**
     * Require sender to be the owner of the contract to continue the execution
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can perform this operation");
        _;
    }

    /**
     * Require sender to be an admin of the contract to continue the execution
     */
    modifier onlyAdmin() {
        require(
            isAdmin[msg.sender],
            "only a valid admin can perform this operation"
        );
        _;
    }
}
