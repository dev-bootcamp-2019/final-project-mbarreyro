pragma solidity ^0.5.0;

/**
 * @title Emergency Stoppable a circuit breaker implementation
 * @author Martin Ernesto Barreyro (barreyromartin@gmail.com)
 */
contract EmergencyStoppable {
    bool private stopped = false;
    mapping(address => bool) private isStopper;

    /**
     * Constructor of the contract
     * @param stoppers allowed accounts to stop/start the contract
     */
    constructor(address[] memory stoppers) public {
        for (uint i = 0; i < stoppers.length; i++) {
            isStopper[stoppers[i]] = true;
        }

        isStopper[msg.sender] = true;
    }

    /**
     * Require only an allowed address to perform an action
     */
    modifier onlyStopper() {
        require(
          isStopper[msg.sender] == true,
          "only autorized stoppers can perform this operation"
        );
        _;
    }

    /**
     * This modifier requires that the contract IS NOT STOPPED to continue
     * the execution of the function
     */
    modifier stopInEmergency {
        require(
          !stopped,
          "This action cant be performed at the moment"
        );
        _;
    }

    /**
     * This modifier requires that the contract IS STOPPED to continue
     * the execution of the function
     */
    modifier onlyInEmergency {
        require(stopped, "This action can only be performed in an emergency");
        _;
    }

    /**
     * Stops the contract. Only functions not required to be stopped in
     * emergency can continue the execution
     */
    function stop() onlyStopper public {
        stopped = true;
    }

    /**
     * Starts the contract. All functions but required to execute only in
     * emergency continue the execution
     */
    function start() onlyStopper public {
        stopped = false;
    }
}
