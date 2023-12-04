import React, {useEffect, useState} from 'react';
import ApplicationSlideOver from './applicationSlideOver/applyToOpportunitySlideOver';
import daysBetweenDates from '../../utils/daysBetween';
import NoSBTMessage from './noSBTmessage';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base(process.env.REACT_APP_AIRTABLE_BASE);

export default function CampaignOpportunities(props) {
    const [ campaignOpportunities, setCampaignOpportunities ] = useState([]);
    const [ openApplication, setOpenApplication ] = useState(false);
    const [ selectedOpportunity, setSelectedOpportunity ] = useState(null);


    useEffect(() => {
        base("Campaigns_test").select({
            view: 'Grid view',
            filterByFormula: `{status} = 'Active'`
        }).eachPage((records, fetchNextPage) => {
            console.log(records);
            setCampaignOpportunities(records);
            fetchNextPage();
        }, function done(err) {
            if (err) { console.error(err); return; }
        });
    }, []);

    const handleApply = (campaign) => {
        setSelectedOpportunity(campaign);
        setOpenApplication(true);
    }

    return (
        <div className='mx-auto max-w-7xl px-2 md:px-6 lg:px-8'>
            {!props.isSBTHolder && props.isConnected ? <NoSBTMessage/> : null}
            <div className='p-2 md:p-8'>
                <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {campaignOpportunities.map((campaign) => (
                        <li key={campaign.id} className='bg-white overflow-hidden shadow rounded-lg h-96 flex-col flex'>
                            <div className='flex-1 flex flex-col p-6 h-72'>
                                <div className='flex flow-row justify-between items-center'>
                                    <div className='w-36'>
                                        <img className='flex-shrink-0 mx-auto max-h-8' src={campaign.fields.logo_url[0]} alt="company_logo"/>
                                    </div>
                                    <span className="h-6 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                                        Application Open
                                    </span>
                                </div>
                                <div className='flex py-2'>
                                    <h3 className='place-self-center text-gray-900 text-2xl font-medium text-left'>{campaign.fields.task_description}</h3>
                                </div>
                                <p className='text-sm text-gray-700'>
                                    {daysBetweenDates(campaign.fields.first_active_date)} day(s) ago by {campaign.fields.company_name[0]}
                                </p>
                                <dl className='mt-1 flex-grow flex flex-col justify-between'>
                                    <dt className='sr-only'>Ideal User</dt>
                                    <dd className='mt-10 text-sm'>
                                        <span className='mb-2 text-md text-gray-700 font-bold'>
                                            Who we're looking for:  
                                        </span>
                                        <br/>
                                        {campaign.fields.target_user}
                                    </dd>
                                </dl>
                            </div>
                            <div className='mt-auto flex flex-row justify-between p-6 items-center'>
                                <p className='text-lg font-semibold'>
                                    ${campaign.fields.base_rate_per_test} of {campaign.fields.preferred_crypto_for_payment}
                                </p>
                                    <div className='tooltip'>
                                        {!props.isConnected ? <span className='tooltiptext text-xs mb-1'>Connect wallet to apply</span> : 
                                        (!props.isSBTHolder ?
                                            <span className='tooltiptext text-xs mb-1'>You must register to apply, see above.</span> : null)}
                                        <button
                                        disabled={!props.isConnected || !props.isSBTHolder || props.fetchingSBTHolder}
                                        onClick={() => handleApply(campaign)}
                                        className="disabled:bg-slate-400 inline-flex items-center rounded-md border font-semibold border-transparent bg-rose-600 px-6 py-2 text-sm text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                        >
                                            {!props.fetchingSBTHolder ? <span>I'm interested</span> : <span>Checking...</span>}
                                        </button>
                                    </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <ApplicationSlideOver 
                wallet={props.address} 
                show={openApplication} 
                campaign={selectedOpportunity}
                isSBTHolder={props.isSBTHolder}
                setShow={setOpenApplication}
                reverseRecord={props.reverseRecord}
                availableDomains={props.availableDomains}
            />
        </div>
    )
}