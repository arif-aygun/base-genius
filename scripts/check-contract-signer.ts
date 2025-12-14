import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { BaseGeniusBadgeABI } from '../app/contracts/BaseGeniusBadgeABI';

const CONTRACT_ADDRESS = '0xFbCe4fC275837159276532D3BD9Ae2fd32A9eF17';

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

async function checkContractSigner() {
    console.log('🔍 Checking contract signer...\n');
    console.log(`Contract: ${CONTRACT_ADDRESS}\n`);

    try {
        const signer = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseGeniusBadgeABI,
            functionName: 'signer',
        });

        console.log('✅ Current Signer Address:', signer);
        console.log('\n📋 Your New Signer Address: 0x20b17f5e9912403306118b4Db4d929FD9c5F7E90\n');

        if ((signer as string).toLowerCase() === '0x20b17f5e9912403306118b4Db4d929FD9c5F7E90'.toLowerCase()) {
            console.log('✅ Perfect! The signer is already set correctly!');
            console.log('You can proceed with testing.\n');
        } else {
            console.log('⚠️  The signer needs to be updated.\n');
            console.log('🔧 To update the signer:');
            console.log('1. Go to remix.ethereum.org');
            console.log('2. Load contract at:', CONTRACT_ADDRESS);
            console.log('3. Call setSigner with: 0x20b17f5e9912403306118b4Db4d929FD9c5F7E90');
            console.log('4. Confirm the transaction\n');
        }
    } catch (error) {
        console.error('❌ Error checking signer:', error);
    }
}

checkContractSigner();
