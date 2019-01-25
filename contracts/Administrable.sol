pragma solidity ^0.5.0;

contract Administrable {
  address private owner;
  address[] private admins;
  mapping (address => bool) public isAdmin;

  constructor(address[] memory _admins) public {
    owner = msg.sender;
    for (uint i = 0; i < _admins.length; i++) {
        isAdmin[_admins[i]] = true;
    }

    isAdmin[msg.sender] = true;
    admins = _admins;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'only owner can perform this operation');
    _;
  }

  modifier onlyAdmin() {
      require(isAdmin[msg.sender]);
      _;
  }
}
