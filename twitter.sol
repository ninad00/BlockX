// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Twitter {
    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        uint256 id;
        address author;
        string content;
        string ipfsHash; // Stores IPFS hash for the image
        uint256 likes;
    }

    Tweet[] public tweets;
    mapping(address => Tweet[]) public addrtotweets;

    mapping(address => mapping(uint256 => bool)) public addrtolikes;
    address public owner;

    event TweetCreated(
        uint256 id,
        address author,
        string content,
        string ipfsHash
    );

    event TweetFeeUpdated(uint256 newFee);
    event OwnerPaid(address owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "YOU ARE NOT THE OWNER!");
        _;
    }

    // Change max tweet length, only owner can call
    function changeTweetLength(uint16 newTweetLength) public onlyOwner {
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function createTweet(
        string memory _tweet,
        string memory _ipfsHash
    ) public payable {
        require(bytes(_tweet).length <= MAX_TWEET_LENGTH, "Tweet is too long!");

        // Create new tweet
        Tweet memory newTweet = Tweet({
            id: tweets.length,
            author: msg.sender,
            content: _tweet,
            ipfsHash: _ipfsHash,
            likes: 0
        });

        addrtotweets[msg.sender].push(newTweet);
        tweets.push(newTweet);

        emit TweetCreated(
            newTweet.id,
            newTweet.author,
            newTweet.content,
            newTweet.ipfsHash
        );
    }

    // Like a tweet
    function likeTweet(uint256 id) external {
        require(id < tweets.length, "TWEET DOES NOT EXIST");
        if (addrtolikes[msg.sender][id] != true) {
            addrtolikes[msg.sender][id] = true;
            tweets[id].likes += 1;
        } else {
            addrtolikes[msg.sender][id] = false;
            tweets[id].likes--;
        }
    }

    // // Unlike a tweet

    // Get a specific tweet by index
    // function getTweet(
    //     uint256 _i
    // )
    //     public
    //     view
    //     returns (uint256, string memory, string memory, string memory, uint256)
    // {
    //     require(_i < tweets.length, "TWEET DOES NOT EXIST");
    //     Tweet storage rettweet = tweets[_i];
    //     return (
    //         rettweet.id,
    //         rettweet.content,
    //         rettweet.ipfsHash,
    //         rettweet.author,
    //         rettweet.likes
    //     );
    // }

    // Get all tweets of a given address
    function getAllTweets() public view returns (Tweet[] memory) {
        return tweets;
    }
}
