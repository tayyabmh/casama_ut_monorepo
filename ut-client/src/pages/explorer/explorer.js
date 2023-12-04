import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { 
  hasInteractedWithCompoundV2,
  getERC20Balance
} from './explorer_functions';
import {
  OUSD_CONTRACT_ADDRESS,
  DAI_CONTRACT_ADDRESS,
  TETHER_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  cvxCRV_CONTRACT_ADDRESS,
  CRV_CONTRACT_ADDRESS,
  UNISWAP_V3_ROUTER_02_ADDRESS,
  UNISWAP_V3_ROUTER_01_ADDRESS,
  UNISWAP_V2_ROUTER_02_ADDRESS
} from '../../constants/contract_addresses';


// Because you are doing string literal comparison, you need to standardize the addresses to lowercase
const UNISWAP_ADDRESSES_LOWER_CASE = [
  UNISWAP_V3_ROUTER_02_ADDRESS.toLowerCase(),
  UNISWAP_V3_ROUTER_01_ADDRESS.toLowerCase(),
  UNISWAP_V2_ROUTER_02_ADDRESS.toLowerCase()
]



export default function Explorer(props) {
  const [ OUSDbalance, setOUSDbalance ] = useState(0);
  const [ DAIbalance, setDAIbalance ] = useState(0);
  const [ TETHERbalance, setTETHERbalance ] = useState(0);
  const [ USDCbalance, setUSDCbalance ] = useState(0);
  const [ numberofUniSwaps, setNumberOfUniSwaps ] = useState(0);
  const [ CRVbalance, setCRVbalance] = useState(0);
  const [ cvxCRVbalance, setcvxCRVbalance ] = useState(0);
  const [ firstTransaction, setFirstTransaction ] = useState('');
  const [ numberofTxns, setNumberOfTxns ] = useState(0);
  const [ compoundInteractions, setCompoundInteractions ] = useState(0);
  const [ showInformation, setShowInformation ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  // This is currently using a different wallet address than the one in the ConnectButton
  const getCompoundV2Interactions = async (transactions) => {
    const interactions = await hasInteractedWithCompoundV2(transactions);
    setCompoundInteractions(interactions);
  } 



  useEffect(() => {

    const getOnChainInformation = async (walletAddress) => {
      setIsLoading(true);
      const response = await axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=' + walletAddress + '&startblock=0&endblock=99999999&sort=asc&apikey=' + process.env.REACT_APP_ETHERSCAN_API_KEY);
      const transactions = response.data.result;
      getUniswapInfo(transactions);
      getFirstTransactionAndNumberofTxns(transactions);
      getCompoundV2Interactions(transactions);
      setShowInformation(true);
      setDAIbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, DAI_CONTRACT_ADDRESS), 18));
      setOUSDbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, OUSD_CONTRACT_ADDRESS), 18));
      setTETHERbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, TETHER_CONTRACT_ADDRESS), 6));
      setUSDCbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, USDC_CONTRACT_ADDRESS), 6));
      setTimeout(async () => {
      setcvxCRVbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, cvxCRV_CONTRACT_ADDRESS), 18));
      setCRVbalance(ethers.utils.formatUnits(await getERC20Balance(walletAddress, CRV_CONTRACT_ADDRESS), 18));
      }, 1000);
      setIsLoading(false);
    }

    if (props.wallet_address){
        getOnChainInformation(props.wallet_address);
    }
  }, [props.wallet_address])




  const getUniswapInfo = async (transactions) => {
    const UNISWAP_INTERACTIONS = []
    transactions.forEach(txn => {
      if (UNISWAP_ADDRESSES_LOWER_CASE.includes(txn.to)) {
        UNISWAP_INTERACTIONS.push(txn);
      }
    })
    setNumberOfUniSwaps(UNISWAP_INTERACTIONS.length);
  }

  const getFirstTransactionAndNumberofTxns = async (transactions) => {
    const firstTransactionTimestamp = transactions[0].timeStamp;
    const firstTransactionDate = timeConverter(firstTransactionTimestamp);
    setFirstTransaction(firstTransactionDate);
    setNumberOfTxns(transactions.length);
  }

  return (
    <div className='mx-auto max-w-7xl w-full'>
      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
        <h1 className='text-lg font-semibold mb-2'>On-Chain Information</h1>
          <p className='text-sm text-gray-500'>Select an application on the left to see their on-chain information</p>
          <div className={!showInformation ? 'hidden': ''}>
          <div className='flex flex-col mb-4'>
            <h1 className='text-lg font-bold mb-2'>Stablecoin Assets</h1>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-4'>
              <p>
              
              
                <span className='text-gray-600 text-sm font-semibold'>OUSD Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(OUSDbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/crypto_logos/ousd.svg" alt="OUSD" className="w-6 h-6 inline-block" />
              
              </p>
              <p>
                <span className='text-gray-600 text-sm font-semibold'>DAI Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(DAIbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/dai.png" alt="DAI" className="w-6 h-6 inline-block" />
              </p>
              <p>
                <span className='text-gray-600 text-sm font-semibold'>USDT Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(TETHERbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/crypto_logos/tether.png" alt="USDT" className="w-6 h-6 inline-block" />
              </p>
              <p>
                <span className='text-gray-600 text-sm font-semibold'>USDC Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(USDCbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/usdc.png" alt="USDC" className="w-6 h-6 inline-block" />
              </p>
            </div>
          </div>
          <div className='flex flex-col mt-2'>
            <h1 className='text-lg font-bold mb-2'>DeFi Interactions</h1>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-4'>
              <p> 
                <span className='text-gray-600 text-sm font-semibold'>Uniswap Interactions</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{numberofUniSwaps}</span>
                }
              </p>
              <p> 
                  <span className='text-gray-600 text-sm font-semibold'>Compound Interactions</span> <br/>
                  {isLoading 
                  ? 
                  <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                  :
                  <span className='font-medium'>{compoundInteractions}</span>
                  }
              </p>
              <p>
                <span className='text-gray-600 text-sm font-semibold'>CRV Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(CRVbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/crypto_logos/curvedao.png" alt="CurveDAO" className="w-6 h-6 inline-block" />
              </p>
              <p>
                <span className='text-gray-600 text-sm font-semibold'>cvxCRV Balance</span> <br/>
                {isLoading 
                ? 
                <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
                :
                <span className='font-medium'>{parseFloat(cvxCRVbalance).toFixed(2)} &nbsp;</span>
                }
                <img src="/crypto_logos/convex.png" alt="Convex" className="w-6 h-6 inline-block" />
              </p>
            </div>
          </div>
          <div className='flex flex-col mt-2'>
            <h1 className='text-lg font-bold mb-2'>General information</h1>
          </div>
          <div className ='grid grid-cols-2 gap-5 sm:grid-cols-4'>
            <p>
              <span className='text-gray-600 text-sm font-semibold'>First transaction was on: </span><br/>
              {isLoading
              ?
              <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
              : 
              <span className='font-medium'>{firstTransaction}</span>
              }</p>
            <p>
              <span  className='text-gray-600 text-sm font-semibold'>Total lifetime transactions: </span> <br/>
              {isLoading
              ?
              <span className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse inline-block'>&nbsp;</span>
              :
              <span className='font-medium'>{numberofTxns}</span>
              }
              </p>
            <p>
              <span className='text-gray-600 text-sm font-semibold'>NFTS owned:</span> 
              <br/>
              <a href={"https://opensea.io/" + props.wallet_address} target="_blank" rel="noreferrer" className='text-blue-500 hover:text-blue-700 underline'>
                <img src="/crypto_logos/opensea.png" alt="Opensea" className='w-8 h-8 inline-block'/>
              </a>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a href={"https://rainbow.com/" + props.wallet_address} target="_blank" rel="noreferrer" className='text-blue-500 hover:text-blue-700 underline'>
                <img src="/crypto_logos/rainbow.jpeg" alt="Rainbow" className='w-8 h-8 inline-block'/>
              </a>
            </p>
          </div>
        </div>
      
      </div>
      </div>
    </div>
  );
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year ;
  return time;
}