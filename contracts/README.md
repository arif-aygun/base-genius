# BaseGenius NFT Smart Contracts

This directory contains the smart contracts for BaseGenius weekly quiz badge NFTs.

## Contract Overview

### BaseGeniusBadge.sol

ERC-721 NFT contract that mints unique weekly badges to users who achieve perfect scores (5/5) on quizzes.

**Key Features:**
- ✅ One badge per user per week
- ✅ Week-based metadata system
- ✅ Authorized minter (backend only)
- ✅ Owner controls (pause, URI updates)
- ✅ Token enumeration

## Deployment

Deploy via Remix IDE following the [Remix Deployment Guide](../docs/remix-deployment.md).

## Contract Details

- **Name**: BaseGenius Weekly Badge
- **Symbol**: BGBADGE
- **Standard**: ERC-721 (NFT)
- **Network**: Base (Sepolia testnet / Mainnet)
- **Solidity Version**: ^0.8.20

## Constructor Parameters

When deploying, you need:

1. **initialOwner** - Address that will own the contract
2. **initialMinter** - Backend wallet authorized to mint NFTs
3. **baseURI** - Base URL for metadata (e.g., `https://yourapp.com/metadata/`)

## Main Functions

### Minting (Only Minter)
```solidity
function mintWeeklyBadge(address to, uint256 weekNumber) external returns (uint256 tokenId)
```

### View Functions
```solidity
function hasClaimed(address user, uint256 weekNumber) external view returns (bool)
function getTokenWeek(uint256 tokenId) external view returns (uint256)
function tokensOfOwner(address owner) external view returns (uint256[])
function tokenURI(uint256 tokenId) public view returns (string)
```

### Admin Functions (Only Owner)
```solidity
function setMinter(address newMinter) external
function setBaseURI(string memory newBaseURI) external
function setPaused(bool shouldPause) external
```

## Integration

See [app/lib/nftService.ts](../app/lib/nftService.ts) for TypeScript integration using viem.

## Testing

Test in Remix before deploying:

1. Deploy to Base Sepolia testnet
2. Mint test badge: `mintWeeklyBadge(yourAddress, 50)`
3. Check claim: `hasClaimed(yourAddress, 50)` → should return `true`
4. Try minting again → should fail with "Already claimed"
5. Check token URI: `tokenURI(1)` → returns metadata URL

## Security

- Uses OpenZeppelin's audited contracts
- Only authorized minter can mint NFTs
- Owner can pause contract in emergencies
- Server-side quiz validation prevents cheating

## Documentation

- [Remix Deployment Guide](../docs/remix-deployment.md)
- [NFT Metadata Specification](../docs/nft-metadata.md)
- [Implementation Walkthrough](../.gemini/antigravity/brain/14da2d5e-cdce-4083-aad8-e286267b7310/walkthrough.md)

## License

MIT
