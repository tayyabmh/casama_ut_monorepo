import React, { useEffect, useState } from 'react';
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react';
import { changeCampaignStatus } from '../../../utils/db/campaign_db';

export default function CampaignSettingsMenu(props) {
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
        }, 4000);
    })

    const handleStatusChange = (status) => {
        changeCampaignStatus(props.campaign.id, status, (record) => {
            const newCampaigns = props.campaigns.map((c) =>  c.id !== record.id ? c : record );
            props.setCampaigns(newCampaigns); 
        });
    }

    return (
        <div>
            <Menu as="div">
            <Cog8ToothIcon 
                className='h-6 w-6 text-gray-900 ml-4 hover:cursor-pointer'
                onClick={() => setOpen(!open)} 
            />
            <Transition
                show={open}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                            
                            {({ active }) => (
                                <button
                                    onClick={() => handleStatusChange(`${props.campaign.fields.status === 'Active' ? 'Inactive' : 'Active'}`)}
                                    className={`${
                                    active ? 'bg-rose-500 text-white' : 'text-gray-900'
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {props.campaign.fields.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                            )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
            </Transition>
            </Menu> 
        </div>
    )
}