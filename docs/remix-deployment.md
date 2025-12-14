# Deploying BaseGeniusBadge Contract via Remix IDE

This guide walks you through deploying the BaseGeniusBadge NFT contract to Base Sepolia (testnet) using Remix IDE.

---

## Prerequisites

- ✅ MetaMask wallet installed
- ✅ Base Sepolia network added to MetaMask
- ✅ Base Sepolia ETH (for gas fees)

---

## Step 1: Get Base Sepolia ETH

### Add Base Sepolia to MetaMask

1. Go to [chainlist.org](https://chainlist.org)
2. Search for "Base Sepolia"
3. Click "Add to MetaMask"

**Or add manually:**
- **Network Name**: Base Sepolia
- **RPC URL**: `https://sepolia.base.org`
- **Chain ID**: `84532`
- **Currency Symbol**: `ETH`
- **Block Explorer**: `https://sepolia.basescan.org`

### Get Testnet ETH

1. Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH (you may need to verify with Coinbase)

**Alternative faucets:**
- https://alchemy.com/faucets/base-sepolia
- https://sepoliafaucet.com (get Sepolia ETH, then bridge to Base Sepolia)

---

## Step 2: Open Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new workspace or use the default

---

## Step 3: Add OpenZeppelin Contracts

### Option A: Import via URL (Easiest)

The contract already has import statements. Remix will auto-download dependencies.

### Option B: Manual Installation (if auto-import fails)

1. In Remix, go to **File Explorer**
2. Create folder: `.deps/npm/@openzeppelin/contracts@5.1.0`
3. Or use Remix's built-in package manager

---

## Step 4: Create the Smart Contract File

1. In Remix **File Explorer**, create a new file:
   ```
   contracts/BaseGeniusBadge.sol
   ```

2. Copy the entire contents from:
   ```
   /Users/ardaceylan/Documents/GitHub/mini-app-quickstart-template/contracts/BaseGeniusBadge.sol
   ```

3. Paste into Remix

---

## Step 5: Compile the Contract

1. Go to **Solidity Compiler** tab (left sidebar)
2. Select compiler version: `0.8.20` or higher
3. Click **Compile BaseGeniusBadge.sol**
4. ✅ Ensure no errors appear

---

## Step 6: Deploy the Contract

### Prepare Constructor Arguments

The contract requires 3 parameters:

1. **initialOwner**: Your wallet address (will own the contract)
2. **initialMinter**: Backend wallet address (will mint NFTs)
3. **baseURI**: Metadata base URL

**Example values:**
```
initialOwner: 0xYourWalletAddress
initialMinter: 0xYourBackendWalletAddress
baseURI: "https://metadata.basegenius.app/"
```

> **Note**: For testing, you can use the same address for both `initialOwner` and `initialMinter`.

### Deploy Steps

1. Go to **Deploy & Run Transactions** tab
2. Set **Environment** to `Injected Provider - MetaMask`
3. Confirm MetaMask is connected to **Base Sepolia**
4. Select contract: `BaseGeniusBadge`
5. Fill in constructor parameters:
   ```
   INITIALOWNER: 0xYourAddress
   INITIALMINTER: 0xYourAddress (or separate backend wallet)
   BASEURI: "https://your-metadata-url.com/"
   ```
6. Click **Deploy**
7. Confirm transaction in MetaMask
8. Wait for deployment confirmation

---

## Step 7: Verify Deployment

### In Remix

After deployment, you'll see the contract under **Deployed Contracts**.

**Test basic functions:**
1. Expand the deployed contract
2. Try calling `name()` → Should return "BaseGenius Weekly Badge"
3. Try calling `symbol()` → Should return "BGBADGE"
4. Try calling `minter()` → Should return your minter address

### On BaseScan

1. Copy the deployed contract address
2. Go to [sepolia.basescan.org](https://sepolia.basescan.org)
3. Paste your contract address
4. You should see the contract deployment transaction

---

## Step 8: Verify Contract on BaseScan (Optional but Recommended)

1. Go to your contract on [sepolia.basescan.org](https://sepolia.basescan.org)
2. Click **Contract** tab → **Verify and Publish**
3. Select:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20
   - **License**: MIT
4. Paste your contract code
5. Add **Constructor Arguments** (ABI-encoded)
6. Click **Verify and Publish**

**To get ABI-encoded constructor arguments:**
- In Remix, after deployment, check the transaction details
- Or use an [ABI encoder tool](https://abi.hashex.org/)

---

## Step 9: Save Contract Details

**IMPORTANT**: Save these values to your `.env` file:

```env
# Smart Contract Configuration
NFT_CONTRACT_ADDRESS=0xYourDeployedContractAddress
BACKEND_PRIVATE_KEY=0xYourMinterWalletPrivateKey
BASE_RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
```

### Get Your Private Key (for minting)

> ⚠️ **SECURITY WARNING**: Never commit private keys to Git!

**In MetaMask:**
1. Click the 3 dots → Account Details
2. Click **Show private key**
3. Enter password
4. Copy private key
5. Add to `.env` file (NOT `.env.example`)

---

## Step 10: Test Minting

You can test minting directly in Remix:

1. In Remix, under deployed contract, find `mintWeeklyBadge`
2. Fill in parameters:
   ```
   to: 0xYourWalletAddress
   weekNumber: 50
   ```
3. Click **transact**
4. Confirm in MetaMask
5. Check your wallet or OpenSea to see the NFT!

---

## Troubleshooting

### "Gas estimation failed"
- Ensure you have enough Base Sepolia ETH
- Check that you're on Base Sepolia network

### "Compiler version mismatch"
- Set compiler to ^0.8.20 in Remix
- Enable optimization if needed

### "Transaction failed"
- Check you're using the minter address to call `mintWeeklyBadge`
- Verify user hasn't already claimed this week's badge

### "Cannot find imported contracts"
- Remix should auto-download OpenZeppelin
- If not, use: `npm install @openzeppelin/contracts` locally and import

---

## Next Steps

After deployment:
1. ✅ Update `.env` with contract address
2. ✅ Test minting via Remix
3. ✅ Integrate minting into Next.js API
4. ✅ Create metadata JSON files
5. ✅ Test full flow in your app

---

## Production Deployment (Base Mainnet)

When ready for production:

1. Switch MetaMask to **Base Mainnet**
   - RPC: `https://mainnet.base.org`
   - Chain ID: `8453`
2. Get real ETH for gas fees
3. Deploy using same steps
4. Update `.env` with mainnet values:
   ```env
   NFT_CONTRACT_ADDRESS=0xMainnetContractAddress
   BASE_RPC_URL=https://mainnet.base.org
   CHAIN_ID=8453
   ```

---

## Contract Functions Reference

### Minting (Only Minter)
- `mintWeeklyBadge(address to, uint256 weekNumber)` - Mint badge for a week

### View Functions (Anyone)
- `hasClaimed(address user, uint256 weekNumber)` - Check if user claimed a week
- `getTokenWeek(uint256 tokenId)` - Get week number for a token
- `tokensOfOwner(address owner)` - Get all tokens owned by address
- `tokenURI(uint256 tokenId)` - Get metadata URI for token

### Admin Functions (Only Owner)
- `setMinter(address newMinter)` - Change authorized minter
- `setBaseURI(string newBaseURI)` - Update metadata base URI
- `setPaused(bool shouldPause)` - Pause/unpause contract

---

**Need Help?** Check the [BaseGenius documentation](../README.md) or ask in the team chat!
