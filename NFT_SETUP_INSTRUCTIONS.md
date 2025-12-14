# NFT Setup Instructions

## ✅ Your Contract is Deployed!

**Contract Address:** `0xFbCe4fC275837159276532D3BD9Ae2fd32A9eF17`

**Network:** Base Sepolia (Testnet)

**Block Explorer:** https://sepolia.basescan.org/address/0xFbCe4fC275837159276532D3BD9Ae2fd32A9eF17

---

## 🔧 Step 1: Update Your .env File

Open your `.env` file and add these lines:

```bash
# NFT Smart Contract Configuration
NFT_CONTRACT_ADDRESS=0xFbCe4fC275837159276532D3BD9Ae2fd32A9eF17
SIGNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
CHAIN_ID=84532
```

---

## 🔑 Step 2: Add Your Signer Private Key

The `SIGNER_PRIVATE_KEY` is used to sign messages that authorize users to mint their own NFTs. This should be from a wallet you control (can be the same as the contract deployer).

### Get Private Key from MetaMask:

1. Open MetaMask
2. Click the **3 dots (⋮)** next to your account name
3. Click **Account Details**
4. Click **Show Private Key**
5. Enter your MetaMask password
6. **Copy** the private key (it starts with `0x`)
7. **Paste** it in your `.env` file as `SIGNER_PRIVATE_KEY=0x...`

⚠️ **NEVER share or commit this private key to GitHub!**

> **How it works:** Users mint their own NFTs after getting a perfect score. The backend generates a cryptographic signature proving they earned the right to mint, then users claim the NFT themselves (paying their own gas fees).

---

## 📋 Complete .env Example

Your `.env` file should look something like this:

```bash
NEXT_PUBLIC_URL=https://mini-app-quickstart-template-seven.vercel.app
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here

# NFT Smart Contract Configuration
NFT_CONTRACT_ADDRESS=0x9bAE0d4E4142E4F13613EdEE2f8deF586d0E49dE
CHAIN_ID=84532

# Signature Service (for authorizing mints)
SIGNER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

> **Note:** `SIGNER_PRIVATE_KEY` is used to sign messages authorizing users to mint. Users mint NFTs themselves, so the backend doesn't need to pay gas fees!

---

## 🧪 Step 3: Test NFT Minting

1. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Open your app:** http://localhost:3000

3. **Connect your wallet** (make sure you're on Base Sepolia)

4. **Take the quiz and get 5/5 perfect score**

5. **Click "Claim Your NFT Badge" button**

6. **Confirm the transaction in your wallet**

7. **View your NFT:**
   - In MetaMask (NFT tab)
   - On OpenSea Testnet: https://testnets.opensea.io/account
   - On BaseScan: https://sepolia.basescan.org/address/YOUR_WALLET_ADDRESS

---

## 🎯 What Should Happen

When someone scores 5/5 on the quiz:

1. ✅ Quiz validates answers on backend
2. ✅ Backend generates a cryptographic signature authorizing the mint
3. ✅ Frontend displays "Claim Your NFT Badge" button
4. ✅ User clicks button and confirms transaction in wallet
5. ✅ User's wallet pays gas fees to mint the NFT
6. ✅ User receives NFT badge for Week 50
7. ✅ User can view NFT in wallet and OpenSea

---

## 🔍 Verify Contract Settings

You can verify your contract in Remix:

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. In "Deploy & Run Transactions" tab
3. Set environment to "Injected Provider - MetaMask"
4. Switch to Base Sepolia network
5. Click "At Address" button
6. Paste: `0xFbCe4fC275837159276532D3BD9Ae2fd32A9eF17`
7. Click "At Address"

Now you can call these functions to verify:

- `name()` → Should return "BaseGenius Weekly Badge"
- `symbol()` → Should return "BGBADGE"
- `signer()` → Should return your signer wallet address
- `owner()` → Should return your contract owner address

---

## 🐛 Troubleshooting

### Error: "NFT_CONTRACT_ADDRESS not configured"
- Make sure you added the contract address to `.env`
- Restart your dev server

### Error: "Signature service not configured"
- Add your `SIGNER_PRIVATE_KEY` to `.env`
- Make sure it starts with `0x`
- Restart your dev server

### Error: "User already claimed this week's badge"
- This is normal! Each user can only claim once per week
- Try with a different wallet address

### NFT not showing in wallet
- Wait 1-2 minutes for transaction confirmation
- Check transaction on BaseScan
- Refresh your wallet/OpenSea

### "Connect Wallet to Claim" message
- Click the wallet button at the top of the page
- Connect your wallet before or after taking the quiz
- Retake quiz if needed to get the claim button

---

## 📝 Next Steps

1. ✅ Add contract address to `.env` (Already done)
2. ✅ Add `SIGNER_PRIVATE_KEY` to `.env` (Do this now)
3. ✅ Restart dev server
4. ✅ Test minting by getting perfect score
5. ✅ Click "Claim Your NFT Badge" and confirm in wallet
6. ✅ Verify NFT appears in wallet
7. ✅ Create better badge images (optional)
8. ✅ Deploy to production when ready

---

## 🚀 Going to Production (Base Mainnet)

When you're ready for mainnet:

1. Deploy new contract to Base Mainnet (Chain ID: 8453)
2. Update `.env`:
   ```bash
   NFT_CONTRACT_ADDRESS=0xYourMainnetContractAddress
   SIGNER_PRIVATE_KEY=0xYourSignerPrivateKey
   CHAIN_ID=8453
   ```
3. Deploy app to Vercel
4. Add `.env` variables in Vercel dashboard

> **Note:** Users pay their own gas fees when claiming NFTs, so you don't need to fund a backend wallet!

---

**Your contract is ready for signature-based minting! 🎉**

Users can now claim their own NFT badges after achieving perfect quiz scores!
