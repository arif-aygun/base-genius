// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BaseGeniusBadge
 * @dev ERC721 NFT contract for BaseGenius weekly quiz badges with signature-based minting
 * @notice Users mint badges themselves after earning them via perfect quiz scores
 */
contract BaseGeniusBadge is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ State Variables ============
    
    /// @notice Base URI for token metadata
    string private _baseTokenURI;
    
    /// @notice Address authorized to sign mint approvals (backend server)
    address public signer;
    
    /// @notice Counter for token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Mapping from token ID to week number
    mapping(uint256 => uint256) public tokenWeek;
    
    /// @notice Mapping to track if a user has claimed a specific week's badge
    /// @dev userAddress => weekNumber => hasClaimed
    mapping(address => mapping(uint256 => bool)) public hasClaimedWeek;
    
    /// @notice Mapping to prevent signature replay attacks
    /// @dev signatureHash => used
    mapping(bytes32 => bool) public usedSignatures;
    
    /// @notice Contract pause status for emergency stops
    bool public paused;

    // ============ Events ============
    
    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint256 indexed weekNumber);
    event SignerUpdated(address indexed oldSigner, address indexed newSigner);
    event BaseURIUpdated(string newBaseURI);
    event ContractPaused(bool isPaused);

    // ============ Modifiers ============
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // ============ Constructor ============
    
    /**
     * @dev Initializes the contract
     * @param initialOwner Address that will own the contract
     * @param initialSigner Address authorized to sign mint approvals (backend wallet)
     * @param baseURI Base URI for token metadata
     */
    constructor(
        address initialOwner,
        address initialSigner,
        string memory baseURI
    ) ERC721("BaseGenius Weekly Badge", "BGBADGE") Ownable(initialOwner) {
        require(initialSigner != address(0), "Invalid signer address");
        signer = initialSigner;
        _baseTokenURI = baseURI;
        _tokenIdCounter = 1; // Start token IDs at 1
    }

    // ============ Minting Functions ============
    
    /**
     * @notice Mint a weekly badge with a signature from the backend
     * @dev Users call this themselves after completing quiz with signature proof
     * @param weekNumber Week number for this badge
     * @param signature Signature from backend confirming quiz completion
     */
    function mintWeeklyBadge(uint256 weekNumber, bytes memory signature) 
        external 
        whenNotPaused 
        returns (uint256) 
    {
        require(weekNumber > 0, "Week number must be positive");
        require(!hasClaimedWeek[msg.sender][weekNumber], "Already claimed this week");
        
        // Create the message hash that was signed by backend
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, weekNumber));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        // Verify the signature came from our authorized signer
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        require(recoveredSigner == signer, "Invalid signature");
        
        // Prevent signature replay
        bytes32 signatureHash = keccak256(signature);
        require(!usedSignatures[signatureHash], "Signature already used");
        usedSignatures[signatureHash] = true;
        
        // Mint the NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        tokenWeek[tokenId] = weekNumber;
        hasClaimedWeek[msg.sender][weekNumber] = true;
        
        emit BadgeMinted(msg.sender, tokenId, weekNumber);
        
        return tokenId;
    }

    // ============ View Functions ============
    
    /**
     * @notice Check if a user has claimed a badge for a specific week
     * @param user Address to check
     * @param weekNumber Week number to check
     * @return bool True if user has claimed this week's badge
     */
    function hasClaimed(address user, uint256 weekNumber) external view returns (bool) {
        return hasClaimedWeek[user][weekNumber];
    }
    
    /**
     * @notice Get the week number for a specific token
     * @param tokenId Token ID to query
     * @return uint256 Week number
     */
    function getTokenWeek(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenWeek[tokenId];
    }
    
    /**
     * @notice Get all token IDs owned by an address
     * @param owner Address to query
     * @return uint256[] Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    /**
     * @notice Returns the token URI for a given token ID
     * @param tokenId Token ID to query
     * @return string Token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        uint256 week = tokenWeek[tokenId];
        
        // Returns: baseURI/week-{weekNumber}.json
        return string(abi.encodePacked(_baseTokenURI, "week-", week.toString(), ".json"));
    }
    
    /**
     * @notice Verify a signature without minting (for testing)
     * @param user Address that will receive the badge
     * @param weekNumber Week number
     * @param signature Signature to verify
     * @return bool True if signature is valid
     */
    function verifySignature(
        address user,
        uint256 weekNumber,
        bytes memory signature
    ) external view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(user, weekNumber));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        return recoveredSigner == signer;
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Update the authorized signer address
     * @param newSigner New signer address
     */
    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid signer address");
        address oldSigner = signer;
        signer = newSigner;
        emit SignerUpdated(oldSigner, newSigner);
    }
    
    /**
     * @notice Update the base URI for metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @notice Pause or unpause the contract
     * @param shouldPause True to pause, false to unpause
     */
    function setPaused(bool shouldPause) external onlyOwner {
        paused = shouldPause;
        emit ContractPaused(shouldPause);
    }

    // ============ Required Overrides ============
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
