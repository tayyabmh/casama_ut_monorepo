import Airtable from 'airtable';
import { ethers } from 'ethers';
import { CASAMA_NAME_SERVICE_ABI } from '../../constants/casama_name_service_abi';

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base(process.env.REACT_APP_AIRTABLE_BASE);
const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_RPC_URL);

export function getWalletIfExists(address) {
    return base('minted_profiles').select({
        filterByFormula: `{wallet_address} = '${address}'`
    }).all();
}

export function getCasamaIDIfExists(username) {
    return base('minted_profiles').select({
        filterByFormula: `{casama_identifier} = '${username}'`
    }).all();
}

export  function validateCommHandle(preferredComm, commHandle) {
    if (preferredComm === "Email") {
        const isValid =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(commHandle);
        return isValid;
    } else if (preferredComm === "Telegram") {
        const isValid = /^@/.test(commHandle);
        return isValid;
    }
}

export async function mintProfileNFT(casamaID, address) {
    const signingWallet = new ethers.Wallet(process.env.REACT_APP_CASAMA_TESTNET_WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.REACT_APP_CASAMA_SBT_NAME_SERVICE_ADDRESS, CASAMA_NAME_SERVICE_ABI, provider);
    const contractWithSigner = contract.connect(signingWallet);

    let payment_value;

    if (casamaID.length === 3) {
        payment_value = ethers.utils.parseEther("0.05");
    } else if (casamaID.length === 4) {
        payment_value = ethers.utils.parseEther("0.03");
    } else {
        payment_value = ethers.utils.parseEther("0.01");
    }

    return await contractWithSigner.registerOther(casamaID, address, { value: payment_value });
}

export async function addProfileToAirtable(casamaID, address, preferredComm, commHandle, timezone) {
    const fields = {
        casama_identifier: casamaID + '.casama',
        wallet_address: address,
        preferred_comm: preferredComm,
        comm_handle: commHandle,
        timezone: timezone
    };

    return await base('minted_profiles').create([{fields}]);
}

const regExRulesToBlock = [
    // Regular expression to identify whether an email starts with jaki and end with goatmail.uk
    '^jaki.*goatmail.uk$',
    // Regular expression to identify all emails that start with ud.pfp
    '^ud.pfp',
    // Regular expression to identify whether an email ends in "hi2.in"
    '.*hi2.in$'
];

export function blacklistByEmail(email) {
    if (email) {
        return regExRulesToBlock.some((rule) => {
            const regEx = new RegExp(rule);
            return regEx.test(email);
        });
    }
}