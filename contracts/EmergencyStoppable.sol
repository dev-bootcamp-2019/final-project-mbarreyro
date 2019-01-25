pragma solidity ^0.5.0;

contract EmergencyStoppable {
  bool private stopped = false;
  mapping (address => bool) private isStopper;

  constructor(address[] memory stoppers) public {
    for (uint i = 0; i < stoppers.length; i++) {
        isStopper[stoppers[i]] = true;
    }

    isStopper[msg.sender] = true;
  }

  modifier onlyStopper() {
    require(isStopper[msg.sender] == true, 'only autorized stoppers can perform this operation');
    _;
  }

  modifier stopInEmergency { require(!stopped, 'This action cant be performed at the moment'); _; }
  modifier onlyInEmergency { require(stopped, 'This action can only be performed in an emergency'); _; }

  function stop() onlyStopper public {
    stopped = true;
  }

  function start() onlyStopper public {
    stopped = false;
  }
}
