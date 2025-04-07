// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Twitter} from "../src/twitter.sol";
import {Script, console} from "forge-std/Script.sol";

contract deploytwitter is Script {
    function run() public returns (Twitter) {
        vm.startBroadcast();
        Twitter twitter = new Twitter();
        vm.stopBroadcast();
        return twitter;
    }
}
