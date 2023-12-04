
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ApplicationSuccess from './applicationSuccess'
import UnstoppableDomainsOnly from './unstoppableDomainsOnly'
import ApplicationForm from './application_form'
import Airtable from 'airtable'
import { validateCommHandle } from '../../mint/onboard_helpers'

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base(process.env.REACT_APP_AIRTABLE_BASE);



export default function ApplicationSlideOver(props) {
    const [open, setOpen] = useState(props.show);
    const [ submitting, setSubmitting ] = useState(false);
    const [ submissionSuccess, setSubmissionSuccess ] = useState(false);
    const [ alreadyApplied, setAlreadyApplied ] = useState(false);
    const [ unstoppableDomainsOnly, setUnstoppableDomainsOnly ] = useState(false);
    const [ isUDHolder, setIsUDHolder ] = useState(false);
    const [ isUDCampaign, setIsUDCampaign ] = useState(false);
    const [ SQ1_Response, setSQ1_Response ] = useState('');
    const [ SQ2_Response, setSQ2_Response ] = useState('');
    const [ SQ3_Response, setSQ3_Response ] = useState('');
    const [ SQ4_Response, setSQ4_Response ] = useState('');
    const [ SQ5_Response, setSQ5_Response ] = useState('');
    const [ emailForNonCasamaId, setEmailForNonCasamaId ] = useState('');


    useEffect(() => {
      if (props.show === false) {
          setSQ1_Response('');
          setSQ2_Response('');
          setSQ3_Response('');
          setSQ4_Response('');
          setSQ5_Response('');
      }
  }, [props.show])

    const confirmUserHasAnsweredAllQuestions = () => {
      if (props.campaign && props.campaign.screening_question_1 && SQ1_Response === '') {
          alert('Please answer all questions before submitting your application.');
          return false;
      } else if (props.campaign && props.campaign.screening_question_2 && SQ2_Response === '') {
          alert('Please answer all questions before submitting your application.');
          return false;
      } else if (props.campaign && props.campaign.screening_question_3 && SQ3_Response === '') {
          alert('Please answer all questions before submitting your application.');
          return false;
      } else if (props.campaign && props.campaign.screening_question_4 && SQ4_Response === '') {
          alert('Please answer all questions before submitting your application.');
          return false;
      } else if (props.campaign && props.campaign.screening_question_5 && SQ5_Response === '') {
          alert('Please answer all questions before submitting your application.');
          return false;
      } else if (props.reverseRecord.substring(props.reverseRecord.length - 7, props.reverseRecord.length) !== '.casama') {
          if (emailForNonCasamaId === '') {
              alert('Please enter your email address before submitting your application.');
              return false;
          } else if (!validateCommHandle("Email", emailForNonCasamaId)) {
              alert('Please enter a valid email address before submitting your application.');
              return false;
          }
          return true;
      } else {
          return true;
      }
  }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitting(true);
      if (confirmUserHasAnsweredAllQuestions()) {
        base('new_inquiries_table').create([
            {
                "fields": {
                    "campaign_id": props.campaign.campaign_id,
                    "campaign_name": props.campaign.Name,
                    "wallet_address": props.wallet,
                    "sq1_response": SQ1_Response,
                    "sq2_response": SQ2_Response,
                    "sq3_response": SQ3_Response,
                    "sq4_response": SQ4_Response,
                    "sq5_response": SQ5_Response,
                    "casama_id": props.reverseRecord,
                    "client_selection_status": "New",
                    "emailForNonCasamaId": emailForNonCasamaId
                }
            }
        ], function(err, records) {
  
            if (err) {
                console.error(err);
                return;
            }
  
            setSQ1_Response('');
            setSQ2_Response('');
            setSQ3_Response('');
            setSQ4_Response('');
            setSQ5_Response('');
            setSubmitting(false);
            setSubmissionSuccess(true);
  
            setTimeout(() => {
                props.setShow(false);
            }, 2000);
  
            setTimeout(() => {
                setSubmissionSuccess(false);
            },3000);
  
        });
      } else {
        setSubmitting(false);
      }
    }


    const checkIfUserHasAlreadyAppliedToOpportunity = (address, campaign_id) => {
      base('new_inquiries_table').select({
          filterByFormula: `AND({wallet_address} = "${address}", {campaign_id} = "${campaign_id}")`
      }).firstPage(function(err, records) {
          if (err) { console.error(err); return; }
          if (records.length > 0) {
              setAlreadyApplied(true);
          }
      });
    }


    useEffect(() => {

      if (props.campaign && props.show) {
        checkIfUserHasAlreadyAppliedToOpportunity(props.wallet, props.campaign.campaign_id);
        setUnstoppableDomainsOnly(props.campaign.onlyForUDHolders)
        setIsUDHolder(props.availableDomains.unstoppableDomains.length > 0)
        setIsUDCampaign(props.campaign.isUDCampaign);
      }

    }, [props.show, props.campaign, props.wallet, props.availableDomains.unstoppableDomains]);



    useEffect(() => {
        setOpen(props.show);
        if(props.show === false) {
            setTimeout(() => {
            setAlreadyApplied(false);
            }, 800);
        }
    }, [props.show]);

    

  

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.setShow}>
      <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-full max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-slate-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">Application for Opportunity</Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-slate-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => props.setShow(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-slate-200">
                            Get started by helping out partners get to know you better, we want to ensure this will be a valuable interaction for both of you.
                          </p>
                        </div>
                      </div>
                      { // Display a message if this is a Unstoppable Domains study, only for UD holders, and the person is not a UD holder
                        (isUDCampaign && unstoppableDomainsOnly && !isUDHolder ? 
                          <UnstoppableDomainsOnly unstoppableDomainsOnly={unstoppableDomainsOnly} isUDHolder={isUDHolder} />
                        : 
                          // Display a message if this is an Unstoppable Domains study, for non-UD holders, and the person holds a UD domain
                          (isUDCampaign && !unstoppableDomainsOnly && isUDHolder ?
                            <UnstoppableDomainsOnly unstoppableDomainsOnly={unstoppableDomainsOnly} isUDHolder={isUDHolder} />
                          :
                            // Display a message if the person has alreay applied to this study or just submitted successfully.
                            (submissionSuccess || alreadyApplied ?
                              <ApplicationSuccess />
                            :
                              // Finally if all of the above checks are fine, then display the application form.
                              <ApplicationForm 
                                reverseRecord={props.reverseRecord} 
                                campaign={props.campaign} 
                                show={props.show}
                                SQ1_Response={SQ1_Response}
                                SQ2_Response={SQ2_Response}
                                SQ3_Response={SQ3_Response}
                                SQ4_Response={SQ4_Response}
                                SQ5_Response={SQ5_Response}
                                emailForNonCasamaId={emailForNonCasamaId}
                                setSQ1_Response={setSQ1_Response}
                                setSQ2_Response={setSQ2_Response}
                                setSQ3_Response={setSQ3_Response}
                                setSQ4_Response={setSQ4_Response}
                                setSQ5_Response={setSQ5_Response}
                                setEmailForNonCasamaId={setEmailForNonCasamaId}
                              />
                      )))}
                      
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-700 bg-white py-2 px-4 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => props.setShow(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        disabled={alreadyApplied || !props.isSBTHolder || (unstoppableDomainsOnly && !isUDHolder)}
                        className="disabled:bg-gray-400 ml-4 inline-flex justify-center disabled:cursor-not-allowed rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {submitting ? 
                        (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : 
                        <span>Submit</span>
                        }
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
