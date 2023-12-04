import axios from "axios";
import { ethers } from "ethers";
import { CASAMA_NAME_SERVICE_ABI } from '../constants/casama_name_service_abi';


const alchemyProvider = new ethers.providers.AlchemyProvider("maticmum", process.env.REACT_APP_ALCHEMY_API_KEY);
const SBT_CONTRACT = new ethers.Contract(process.env.REACT_APP_CASAMA_SBT_NAME_SERVICE_ADDRESS, CASAMA_NAME_SERVICE_ABI, alchemyProvider);


export async function getReverseRecordForUD(walletAddress) {
    const reverseRecord = await axios.get(`https://resolve.unstoppabledomains.com/reverse/${walletAddress}`,{
        headers: {
            'Authorization': 'Bearer'
        }
    })
    return reverseRecord.data.meta.domain;
}

export async function getReverseRecordForCasama(walletAddress) {
    const doesHaveCasamaId = await SBT_CONTRACT.getTokenGate(walletAddress);
    if (doesHaveCasamaId) {
        const reverseRecord = await SBT_CONTRACT.getName(walletAddress);
        return reverseRecord;
    }
    return '';
}

