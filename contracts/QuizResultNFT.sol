// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title QuizResultNFT - ERC721 token for minting quiz result badge per (quizId, wallet)
/// @notice Only contract owner (backend wallet) can mint via adminMint
contract QuizResultNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // quizHash => user => minted?
    mapping(bytes32 => mapping(address => bool)) public hasMinted;

    event QuizMinted(address indexed to, uint256 indexed tokenId, string quizId, string tokenURI);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /// @notice Admin mints NFT to address after backend validates perfect score
    /// @param to User's wallet address
    /// @param quizId Unique quiz identifier (e.g., "week-50-2024")
    /// @param tokenURI IPFS URI with metadata
    function adminMint(address to, string calldata quizId, string calldata tokenURI) external onlyOwner nonReentrant {
        bytes32 q = keccak256(bytes(quizId));
        require(!hasMinted[q][to], "Already minted for this wallet & quiz");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        hasMinted[q][to] = true;
        emit QuizMinted(to, tokenId, quizId, tokenURI);
    }

    /// @notice Get total number of minted NFTs
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /// @notice Withdraw collected ETH (if any)
    function withdraw(address payable to) external onlyOwner {
        require(to != address(0), "zero address");
        to.transfer(address(this).balance);
    }
}
