// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract BulletproofSocial {
    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
    }

    mapping(uint256 => Post) public posts;
    uint256 public totalPosts;

    event PostCreated(
        uint256 indexed id,
        address indexed author,
        string content
    );

    function createPost(string memory content) external {
        require(bytes(content).length > 0, "Empty content");
        require(bytes(content).length <= 500, "Content too long");

        totalPosts++;

        posts[totalPosts] = Post({
            id: totalPosts,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        emit PostCreated(totalPosts, msg.sender, content);
    }

    function getTotalPosts() external view returns (uint256) {
        return totalPosts;
    }

    function getPost(uint256 id) external view returns (Post memory) {
        require(id > 0 && id <= totalPosts, "Invalid ID");
        return posts[id];
    }

    function getLatestPosts(
        uint256 count
    ) external view returns (Post[] memory) {
        uint256 returnCount = count > totalPosts ? totalPosts : count;
        Post[] memory latestPosts = new Post[](returnCount);

        for (uint256 i = 0; i < returnCount; i++) {
            latestPosts[i] = posts[totalPosts - i];
        }

        return latestPosts;
    }
}
