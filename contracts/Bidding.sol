// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bidding {
    address public token;

    struct Auction {
        uint256 id;
        uint256 highestBid;
        address highestBidder;
        uint256 startTime;
        uint256 endTime;
    }

    Auction[] public auctions;

    function createAuction(
        uint256 startTime,
        uint256 endTime
    ) public {
        Auction memory auction = Auction({
            id: auctions.length,
            highestBid: 0,
            highestBidder: address(0),
            startTime: startTime,
            endTime: endTime
        });
        auctions.push(auction);
    }

    function getLatestAuction() public view returns (Auction memory auction) {
        auction = auctions[auctions.length - 1];
        return auction;
    }

    function placeBid(uint256 id, uint256 amount) public {
        Auction memory auction = auctions[id];
        require(
            block.timestamp >= auction.startTime &&
                block.timestamp <= auction.endTime,
            "Auction not active"
        );
        require(
            amount > auction.highestBid,
            "Bid must be higher than current highest bid"
        );

        // TRANSFER THE OLD HIGHEST BID TO THE PREVIOUS HIGHEST BIDDER
        if (auction.highestBidder != address(0)) {
            bool success = IERC20(token).transfer(
                auction.highestBidder,
                auction.highestBid
            );
            require(success, "Previous highest bid refund failed");
        }

        // TRANSFER THE NEW BID TO THE AUCTION
        bool newBidSuccess = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(newBidSuccess, "New bid transfer failed");

        auction.highestBid = amount;
        auction.highestBidder = msg.sender;

        auctions[id] = auction;
    }

    function setToken(address _token) public {
        token = _token;
    }

    function getToken() public view returns (address) {
        return token;
    }
}
