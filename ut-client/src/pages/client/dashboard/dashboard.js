import React from 'react';
import CampaignStatusPill from './campaign_status_pill';
import CampaignSettingsMenu from './campaignSettingsMenu';



export default function ClientDashboard(props) {
    const { campaigns, setCampaigns, applications } = props;

    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
            <div className='mx-auto md:hidden lg:hidden  mt-8'>
                <img className="w-48 mx-auto"src="/coming-soon.png" alt="Coming Soon" />
                <p className='text-md text-gray-700 font-medium text-center p-4'>The Client-side expereience is only available through a monitor-sized screen size today.</p>
            </div>
            <div className='hidden md:grid lg:grid grid-cols-1 gap-4'>
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className='bg-white overflow-hidden shadow rounded-lg p-6'>
                        <div className='flex flex-col md:flex-row lg:flex-row justify-between'>
                            <h3 className='text-2xl font-semibold'>{campaign.fields.Name}</h3>
                            <div className='flex flex-row items-center'>
                                <CampaignStatusPill status={campaign.fields.status} />
                                    <a 
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg h-10 align-middle ml-4'
                                        href={`/applicants/${campaign.id}`}
                                    >
                                        See Applicants
                                    </a>
                                <CampaignSettingsMenu 
                                    setCampaigns={setCampaigns} 
                                    campaign={campaign}
                                    campaigns={campaigns}
                                />
                            </div>
                        </div>
                        <div>
                            <p className='text-gray-700 text-md'><span className='text-black font-semibold'>Task Description:</span> {campaign.fields.task_description}</p>
                        </div>
                            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 mt-4 bg-slate-300 rounded border-2 border-slate-400 p-2 justify-items-center'>
                            <div>
                                    <p className='text-md font-semibold'>Requested</p>
                                    <p className='text-lg'>{campaign.fields.max_number_of_testers}</p>
                                </div>
                                <div>
                                    <p className='text-md font-semibold'>Applicants</p>
                                    <p className='text-lg'>{getApplicantsLengthForCampaign(applications, campaign.id)}</p>
                                </div>
                                <div>
                                    <p className='text-md font-semibold'>Approved</p>
                                    <p className='text-lg'>{getApprovedApplicantsLength(applications, campaign.id)}</p>
                                </div>
                                <div>
                                    <p className='text-md font-semibold'>Completed</p>
                                    <p className='text-lg'>0</p>
                                </div>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const getApplicantsLengthForCampaign = (records, campaign_id) => {
    const filteredRecords = records.filter(record => record.fields.campaign_id === campaign_id);
    return filteredRecords.length;
}

const getApprovedApplicantsLength = (records, campaign_id) => {
    const filteredRecords = records.filter(record => record.fields.campaign_id === campaign_id && record.fields.client_selection_status === "Approved");
    return filteredRecords.length;
}