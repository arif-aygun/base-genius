import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

/**
 * Generate a new wallet for signature-based minting
 * This wallet is ONLY used for signing - it doesn't need any funds!
 */

console.log('🔐 Generating New Signer Wallet...\n');

// Generate a random private key
const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log('✅ New wallet generated!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 WALLET DETAILS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Address:      ${account.address}`);
console.log(`Private Key:  ${privateKey}\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 ADD TO YOUR .env FILE:\n');
console.log(`SIGNER_PRIVATE_KEY=${privateKey}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('⚠️  IMPORTANT SECURITY NOTES:\n');
console.log('1. This wallet is ONLY for signing (authorizing mints)');
console.log('2. It does NOT need any funds (ETH or tokens)');
console.log('3. Keep the private key in .env (never commit to git!)');
console.log('4. This is separate from your main wallet\n');

console.log('🎯 NEXT STEPS:\n');
console.log('1. Copy the SIGNER_PRIVATE_KEY line above');
console.log('2. Add it to your .env file');
console.log('3. Update the contract signer address if needed');
console.log('4. Restart your dev server (npm run dev)\n');
