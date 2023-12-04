import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'


export function blank() {
    return (
        <div className='grid place-items-center' style={{ height: '50vh'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/3156/3156065.png" alt="no sbt" className="h-48 sm:h-60" />
            <p className='text-md text-gray-500 sm:w-96 w-72 text-center'>
                Whoops! Looks like you haven't minted a Casama Profile NFT yet. Click the button below to get one! (If you have just minted your NFT, just hit refresh or wait a minute.)
            </p>
            <a
                href="/mint"
                className='bg-rose-800 rounded relative px-10 flex-1 inline-flex items-center justify-center py-4 text-sm font-bold text-gray-100 border border-transparent hover:underline'
            >
                Mint my Casama Profile
            </a>
        </div>
    )
}


export default function NoSBTMessage() {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-7 w-7 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
        <h3 className="text-md font-medium text-yellow-800">Attention needed</h3>
          <p className="text-md text-yellow-700">
            It looks like you are not registered with a Casama profile. {' '}
            <a href="/register" className="font-medium text-yellow-700 underline hover:text-yellow-600">
              Click here to register and get your profile NFT.
            </a>
          </p>
          <p className='text-md font-medium text-yellow-700 italic'>If you just registered, wait a few moments and refresh the page.</p>
        </div>
      </div>
    </div>
  )
}
