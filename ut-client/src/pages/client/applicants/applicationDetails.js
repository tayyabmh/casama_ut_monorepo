import React, { useState } from 'react';
import {
  approveApplicant,
  disqualifyApplicant
} from '../../../utils/db/applicants_db';
import ApplicantActionNotification from './applicantActionNotification';
import ApprovalConfirmation from './approvalConfirmation';

export default function ApplicationDetails(props) {
  const [ showNotification, setShowNotification ] = useState(false);
  const [ showApprovalConfirmation, setShowApprovalConfirmation ] = useState(false);

  const handleApprove = () => {
    setShowApprovalConfirmation(true);
  }

  const confirmApproval = () => {
    const applicationId = props.applicants.find(applicant => applicant.fields.casama_id === props.activeCasamaId).id;
    approveApplicant(applicationId, (record) => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);

      // Replace the old applicant with the new applicant
      const newApplicants = props.applicants.map(applicant => {
        if (applicant.fields.casama_id === props.activeCasamaId) {
          return record;
        }
        return applicant;
      });
      props.setApplicants(newApplicants);
    });
  }


  const handleDisqualify = () => {
      const applicationId = props.applicants.find(applicant => applicant.fields.casama_id === props.activeCasamaId).id;
      disqualifyApplicant(applicationId, (record) => {
        
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 4000);

      // Replace the old applicant with the new applicant
      const newApplicants = props.applicants.map(applicant => {
        if (applicant.fields.casama_id === props.activeCasamaId) {
          return record;
        }
        return applicant;
      });
      props.setApplicants(newApplicants);
    });
  }

  return (
    
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Application Details</h3>
        <div className='flex flex-row gap-4'>
          <button
            type="button"
            onClick={handleDisqualify}
            disabled={props.activeCasamaId === ''}
            className="w-28 items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Disqualify
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={props.activeCasamaId === ''}
            className="w-28 items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Approve
          </button>
        </div>
      </div>
      {props.activeCasamaId ? 
    (
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">
                <h3 className='text-sm font-normal'><span className='text-md font-semibold underline'>Screening Question #1</span><br/>{props.campaign.fields.screening_question_1}</h3>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{props.applicants.find((applicant) => applicant.fields.casama_id === props.activeCasamaId).fields.sq1_response}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">
                <h3 className='text-sm font-normal'><span className='text-md font-semibold underline'>Screening Question #2</span><br/>{props.campaign.fields.screening_question_2}</h3>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{props.applicants.find((applicant) => applicant.fields.casama_id === props.activeCasamaId).fields.sq2_response}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">
                <h3 className='text-sm font-normal'><span className='text-md font-semibold underline'>Screening Question #3</span><br/>{props.campaign.fields.screening_question_3}</h3>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{props.applicants.find((applicant) => applicant.fields.casama_id === props.activeCasamaId).fields.sq3_response}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">
                <h3 className='text-sm font-normal'><span className='text-md font-semibold underline'>Screening Question #4</span><br/>{props.campaign.fields.screening_question_4}</h3>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{props.applicants.find((applicant) => applicant.fields.casama_id === props.activeCasamaId).fields.sq4_response}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-700">
                <h3 className='text-sm font-normal'><span className='text-md font-semibold underline'>Screening Question #5</span><br/>{props.campaign.fields.screening_question_5}</h3>
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{props.applicants.find((applicant) => applicant.fields.casama_id === props.activeCasamaId).fields.sq5_response}</dd>
          </div>
        </dl>
      </div>
    ) : (
        <div className="border-t border-gray-200 px-4 py-8 sm:p-0 text-center items-center justify-center h-20">
            <p className='text-md font-medium text-slate-800 mt-6'>Select an application on the left to see their application.</p>
        </div>    
    )}
      {
        showNotification
        ? <ApplicantActionNotification show={showNotification} setShow={setShowNotification}  />
        : null
      }
      {
        showApprovalConfirmation
        ? <ApprovalConfirmation show={showApprovalConfirmation} setShow={setShowApprovalConfirmation} confirmApproval={confirmApproval} />
        : null
      }
    </div>
  )
}
