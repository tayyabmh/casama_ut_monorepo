import React from 'react';


export default function ApplicationForm(props) {
    return (
        <div className="flex flex-1 flex-col justify-between">
            <div className="divide-y divide-gray-200 px-4 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                    <div>
                        <label htmlFor='wallet-address' className='block text-sm font-semibold text-gray-900'>
                            Your Identifier
                        </label>
                        <p className='mt-1 text-sm text-gray-600 truncate'>
                            {props.reverseRecord}
                        </p>
                    </div>
                    {props.reverseRecord.substring(props.reverseRecord.length - 7, props.reverseRecord.length) !== '.casama' ?
                        (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={props.emailForNonCasamaId}
                                        onChange={(e) => props.setEmailForNonCasamaId(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            ) :
                            null
                        }
                        {
                            (props.campaign && props.campaign.screening_question_1) ? (
                                <div>
                                    <label htmlFor='screen-question-1' className='block text-sm font-semibold text-gray-900'>
                                        Screening Question #1
                                    </label>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {props.campaign.screening_question_1}
                                    </p>
                                    <div className='mt-1'>
                                        <textarea
                                            id='screen-question-1'
                                            name='screen-question-1'
                                            rows={3}
                                            className='shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                                            value={props.SQ1_Response}
                                            onChange={(e) => props.setSQ1_Response(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            (props.campaign && props.campaign.screening_question_2) ? (
                                <div>
                                    <label htmlFor='screen-question-2' className='block text-sm font-semibold text-gray-900'>
                                        Screening Question #2
                                    </label>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {props.campaign.screening_question_2}
                                    </p>
                                    <div className='mt-1'>
                                        <textarea
                                            id='screen-question-2'
                                            name='screen-question-2'
                                            rows={3}
                                            className='shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                                            value={props.SQ2_Response}
                                            onChange={(e) => props.setSQ2_Response(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            (props.campaign  && props.campaign.screening_question_3) ? (
                                <div>
                                    <label htmlFor='screen-question-3' className='block text-sm font-semibold text-gray-900'>
                                        Screening Question #3
                                    </label>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {props.campaign.screening_question_3}
                                    </p>
                                    <div className='mt-1'>
                                        <textarea
                                            id='screen-question-3'
                                            name='screen-question-3'
                                            rows={3}
                                            className='shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                                            value={props.SQ3_Response}
                                            onChange={(e) => props.setSQ3_Response(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            (props.campaign && props.campaign.screening_question_4) ? (
                                <div>
                                    <label htmlFor='screen-question-4' className='block text-sm font-semibold text-gray-900'>
                                        Screening Question #4
                                    </label>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {props.campaign.screening_question_4}
                                    </p>
                                    <div className='mt-1'>
                                        <textarea
                                            id='screen-question-4'
                                            name='screen-question-4'
                                            rows={3}
                                            className='shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                                            value={props.SQ4_Response}
                                            onChange={(e) => props.setSQ4_Response(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            (props.campaign  && props.campaign.screening_question_5) ? (
                                <div>
                                    <label htmlFor='screen-question-5' className='block text-sm font-semibold text-gray-900'>
                                        Screening Question #5
                                    </label>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {props.campaign.screening_question_5}
                                    </p>
                                    <div className='mt-1'>
                                        <textarea
                                            id='screen-question-5'
                                            name='screen-question-5'
                                            rows={3}
                                            className='shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                                            value={props.SQ5_Response}
                                            onChange={(e) => props.setSQ5_Response(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
    )
                    }