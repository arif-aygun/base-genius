# NFT Minting - Backend Setup Guide

## Overview

The NFT minting system uses **Option B (Backend Validation + adminMint)** which means:
- ✅ Server validates quiz results (prevents cheating)
- ✅ Server uploads metadata to IPFS
- ✅ Server mints NFT automatically for perfect scores
- ✅ User gets NFT for free (no gas fees for them!)

---

## Prerequisites

Before deploying the contract, you'll need:

1. **Base Sepolia ETH** for deployment (~$0.50 worth)
   - Get from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   
2. **NFT.Storage API Key** (FREE)
   - Sign up: https://nft.storage
   - Get API key from dashboard

3. **Deployer Wallet**
   - Create a new wallet for deploying (NOT your personal wallet)
   - This wallet will pay gas for all NFT mints

---

## Step 1: Environment Variables

Add these to your `.env` file (create if it doesn't exist):

```env
# === Existing Variables (already set) ===
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
NEXT_PUBLIC_URL=http://localhost:3000

# === NEW: NFT Minting Variables ===

# 1. Blockchain Connection
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
DEPLOYER_PRIVATE_KEY=0xyour_deployer_private_key_here

# 2. NFT Contract (leave empty until deployed)
NFT_CONTRACT_ADDRESS=

# 3. IPFS Storage
NFT_STORAGE_KEY=your_nft_storage_api_key_here

# 4. Contract Metadata (optional)
CONTRACT_NAME="Base News Genius Badge"
CONTRACT_SYMBOL="BNGB"

# 5. For BaseScan verification (optional)
BASESCAN_API_KEY=your_basescan_api_key_if_you_want_verification
```

---

## Step 2: Install Dependencies

```bash
# Install Hardhat and OpenZeppelin
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts

# Install NFT.Storage and ethers v6
npm install nft.storage ethers@6
```

---

## Step 3: Compile Contract

```bash
npx hardhat compile
```

You should see:
```
✔ Compiled 1 Solidity file successfully
```

---

## Step 4: Deploy to Base Sepolia

```bash
npx hardhat run --network baseSepolia scripts/deploy.ts
```

**Expected output:**
```
Deploying QuizResultNFT...
Name: Base News Genius Badge
Symbol: BNGB

✅ QuizResultNFT deployed to: 0xYourContractAddress

Add this to your .env file:
NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

**Copy the contract address and add it to your `.env`:**
```env
NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

---

## Step 5: Verify Contract on BaseScan (Optional but Recommended)

```bash
npx hardhat verify --network baseSepolia 0xYourContractAddress "Base News Genius Badge" "BNGB"
```

This makes your contract visible on https://sepolia.basescan.org

---

## Step 6: Test Locally

1. **Make sure all env vars are set**
2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Test the flow:**
   - Connect your wallet (use testnet wallet)
   - Complete quiz with 5/5 score
   - Check console for "NFT minted successfully!"
   - Verify NFT appears in your wallet

4. **Check on BaseScan:**
   - Go to: `https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS`
   - Click "Contract" → "Read Contract" → `totalMinted()`
   - Should show "1" after first mint

---

## How It Works

### User Flow:
1. User completes quiz → selects answers
2. Frontend sends `answers` + `walletAddress` to `/api/submit-answers`
3. **Backend validates** (server-side, secure)
4. If score = 5/5:
   - Backend creates metadata (name, description, attributes)
   - Uploads to IPFS via NFT.Storage
   - Calls `adminMint(userAddress, quizId, tokenURI)`
   - NFT is minted to user's wallet
5. Frontend shows "✅ NFT Badge Claimed!"

### Security:
- User can't fake their score (validation is server-side)
- User can't manipulate tokenURI (created server-side)
- Each user can only mint once per quiz ID (enforced in contract)

---

## Troubleshooting

### "Transaction failed"
- **Check:** Do you have Base Sepolia ETH in deployer wallet?
- **Fix:** Get more from Coinbase faucet

### "NFT_STORAGE_KEY not found"
- **Check:** Is `NFT_STORAGE_KEY` in `.env`?
- **Fix:** Add the key from nft.storage dashboard

### "Cannot find CONTRACT_ADDRESS"
- **Check:** Did you deploy the contract?
- **Fix:** Run `npx hardhat run --network baseSepolia scripts/deploy.ts`

### "NFT not appearing in wallet"
- **Check:** Are you on Base Sepolia network in your wallet?
- **Fix:** Switch network to Base Sepolia
- **Check:** View on BaseScan to confirm mint succeeded

### "Failed to upload to IPFS"
- **Check:** Is your NFT.Storage API key valid?
- **Fix:** Generate a new key if needed

---

## Production Deployment

When ready for mainnet:

1. **Get Base Mainnet ETH** (for gas)
2. **Update `.env`:**
   ```env
   BASE_RPC_URL=https://mainnet.base.org
   NFT_CONTRACT_ADDRESS=  # Leave empty, will redeploy
   ```
3. **Add mainnet network to `hardhat.config.ts`:**
   ```typescript
   base: {
     url: "https://mainnet.base.org",
     accounts: [process.env.DEPLOYER_PRIVATE_KEY],
     chainId: 8453,
   }
   ```
4. **Deploy:**
   ```bash
   npx hardhat run --network base scripts/deploy.ts
   ```
5. **Update production env vars** on Vercel with new contract address

---

## Cost Estimates

### Deployment:
- Contract deploy: ~$0.50 in Base Sepolia ETH (testnet)
- Contract deploy: ~$5-10 in Base ETH (mainnet)

### Per NFT Mint:
- Testnet: Free (faucet ETH)
- Mainnet: ~$0.05-0.10 per mint

### IPFS Storage:
- FREE (NFT.Storage free tier)

---

## Next Steps

✅ Contract deployed
✅ Environment configured
✅ NFT minting tested

**Now:**
1. Test with your team
2. Deploy to Vercel (production)
3. Switch to mainnet when ready
4. Monitor gas costs

---

## Quick Reference

**Check total minted:**
```bash
npx hardhat console --network baseSepolia
> const contract = await ethers.getContractAt("QuizResultNFT", "0xYourAddress")
> await contract.totalMinted()
```

**View on BaseScan:**
```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

**Get Base Sepolia ETH:**
```
https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
```

Good luck! 🚀
