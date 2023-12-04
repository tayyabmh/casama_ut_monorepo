import { COMPOUND_V2_TOKENS } from '../../constants/compoundV2_tokens';
import axios from 'axios';


export async function hasInteractedWithCompoundV2(transactions) {
    const Compound_Txns = [];
    transactions.forEach(txn => {
        COMPOUND_V2_TOKENS.forEach(token => {
            if (txn.to === token.address) {
                Compound_Txns.push(token.token);
            }
        })
    })
    return Compound_Txns.length;
}

export async function getERC20Balance(address, tokenAddress) {
    const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    const balance = response.data.result;
    return balance;
}