import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import CampaignOpportunities from '../opportunities/campaign_opportunities';
import {
    getReverseRecordForCasama,
    getReverseRecordForUD
} from '../../utils/getDomains.js'


export default function Home() {
    const { address, isConnected } = useAccount();
    const [ isSBTHolder, setIsSBTHolder ] = useState(false);
    const [ fetchingSBTHolder, setFetchingSBTHolder ] = useState(false);
    const [ reverseRecord, setReverseRecord ] = useState('');
    const [ availableDomains, setAvailableDomains ] = useState({});
    

    useEffect(() => {
        if (isConnected) {
            setFetchingSBTHolder(true);
            (async function() {
                const casamaReverseRecord = await getReverseRecordForCasama(address);
                const unstoppableDomainsReverseRecord = await getReverseRecordForUD(address);

                if (casamaReverseRecord.length > 0) {
                    setReverseRecord(casamaReverseRecord + '.casama');
                    setIsSBTHolder(true);
                } else if (unstoppableDomainsReverseRecord.length > 0) {
                    setReverseRecord(unstoppableDomainsReverseRecord);
                    setIsSBTHolder(true);
                } else {
                    setIsSBTHolder(false);
                }

                setAvailableDomains({
                    casama: casamaReverseRecord,
                    unstoppableDomains: unstoppableDomainsReverseRecord
                });
                
                setFetchingSBTHolder(false);
            })();
        }
    }, [isConnected, address]);

    
    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
                <CampaignOpportunities 
                    address={address}
                    isSBTHolder={isSBTHolder}
                    isConnected={isConnected}
                    fetchingSBTHolder={fetchingSBTHolder}
                    reverseRecord={reverseRecord}
                    availableDomains={availableDomains}
                />
          
        </div>
    );
}