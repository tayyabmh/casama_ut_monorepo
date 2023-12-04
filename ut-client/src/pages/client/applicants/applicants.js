import React, { useEffect, useState } from 'react';
import Explorer from '../../explorer/explorer';
import ApplicantList from './applicantList';
import ApplicationDetails from './applicationDetails';
import { useParams } from 'react-router-dom';
import { getCampaignInformation } from '../../../utils/db/campaign_db';
import { getApplicantsForCampaign } from '../../../utils/db/applicants_db';
import IfNoApplicants from './ifNoApplicants';


export default function Applicants(props) {
    const { campaignId } = useParams();
    const { campaigns } = props;
    const [ applicants, setApplicants ] = useState([]);
    const [ campaign, setCampaign ] = useState({});
    const [ activeWallet, setActiveWallet ] = useState('');
    const [ activeCasamaId, setActiveCasamaId ] = useState('');


    useEffect(() => {
        getApplicantsForCampaign(campaignId, (applicants) => {
            const sortedApplicants = applicants.sort((a, b) => { 
                if (a.fields.client_selection_status === 'Approved') {
                    return -1;
                } else if (a.fields.client_selection_status === 'Disqualified') {
                    return 1;
                } else {
                    return 0;
                }
            });
            setApplicants(sortedApplicants);
        });
    }, [campaignId]);

    useEffect(() => {
        getCampaignInformation(campaignId, (record) => {
            setCampaign(record);
        })
    }, [campaignId]);

    const [ recordTitle, setRecordTitle ] = useState('');
    const [ recordId, setRecordId ] = useState('');

    useEffect(() => {
        const path = window.location.pathname;
        const splitPath = path.split('/');
        setRecordId(splitPath[splitPath.length - 1]);
        if (recordId.length > 0) {
            const record = campaigns.find(record => record.id === recordId);
            if (record) {
                setRecordTitle(record.fields.Name);
            }
        }
    }, [campaigns, recordId])


    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10'>
            <div className='mx-auto md:hidden lg:hidden  mt-8'>
                <img className="w-48 mx-auto"src="/coming-soon.png" alt="Coming Soon" />
                <p className='text-md text-gray-700 font-medium text-center p-4'>The Client-side expereience is only available through a monitor-sized screen size today.</p>
            </div>
            <div className='invisible md:visible lg:visible'>
                <div className='text-xl py-4 px-2 text-gray-500 underline'>
                    <p><span className='font-semibold text-gray-700'>Campaign Title: </span>{recordTitle}</p>
                </div>
                <div className='grid-cols-3 gap-4 divide-x divide-slate-600 hidden md:grid lg:grid'>
                    {applicants.length > 0
                        ? <ApplicantList applicants={applicants} setActiveCasamaId={setActiveCasamaId} activeCasamaId={activeCasamaId} setActiveWallet={setActiveWallet}/>
                        : <IfNoApplicants />
                    }
                    <div className='col-span-2 px-6'>
                        <div className='grid grid-row-2 gap-4 divide-y sticky top-10'>
                            <ApplicationDetails applicants={applicants} activeCasamaId={activeCasamaId} campaign={campaign} setApplicants={setApplicants}/>
                            <Explorer wallet_address={activeWallet}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}