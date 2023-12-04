import React from 'react';
import daysBetweenDates from '../../../utils/daysBetween';
import ApplicantStatusPill from './applicantStatusPill';

function currentlySelected(activeCasamaId, casama_id){
    if (activeCasamaId === casama_id){
        return 'bg-emerald-50 drop-shadow-sm';
    }
    return 'bg-white shadow'
}

export default function ApplicantList(props) {
    return (
        <div className='col-span-1 px-2'>
            <h2 className='text-xl font-semibold mb-2'>Applicants</h2>
                <div className='grid grid-cols-1 gap-4 p-1 max-h-full overflow-y-auto'>
                    {props.applicants.map((applicant) => (
                        <div 
                        className={'overflow-hidden rounded-lg px-4 py-4 h-min flex-col hover:cursor-pointer ' + currentlySelected(props.activeCasamaId, applicant.fields.casama_id)} key={applicant.id}
                        onClick={() => {
                            props.setActiveWallet(applicant.fields.wallet_address)
                            props.setActiveCasamaId(applicant.fields.casama_id)
                        }}
                        
                        >
                            <div className='flex-row flex justify-between'>
                                <p 
                                    className='text-left w-full text-semibold text-black'
                                >
                                    {applicant.fields.casama_id}.casama 
                                </p>
                                <ApplicantStatusPill status={applicant.fields.client_selection_status} active={(props.activeApplicant === applicant.fields.wallet_address)} />
                            </div>
                            <p className='text-xs text-gray-500'>Applied {daysBetweenDates(applicant.fields.Created)} day(s) ago</p>
                            <div>
                                {!(props.activeApplicant === applicant.fields.wallet_address)
                                ? <p 
                                    className='text-right w-full text-gray-600 italic text-sm'
                                >
                                    Select to view application
                                </p>
                                : <p className='text-right w-full text-gray-600 italic text-sm'>Selected</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}