import { Disclosure } from '@headlessui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { 
  getReverseRecordForCasama,
  getReverseRecordForUD
} from '../utils/getDomains.js'
import {
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'

const pageHeaders = {
  '/': {
    title: 'Home',
    description: ''
  },
  '/register': {
    title: 'Onboarding',
    description: ''
  }
}



export default function Header(props) {
  const { address, isConnected } = useAccount();
  const [ headerTitle, setHeaderTitle ] = useState('')
  const [ headerDescription, setHeaderDescription ] = useState('')
  const [ applyHighlight, setApplyHighlight ] = useState(false)
  const [ researchHighlight, setResearchHighlight ] = useState(false)

  useEffect(() => {
    const origin = window.location.origin;
    if (origin === 'https://app.casama.xyz') {
      setApplyHighlight(true)
    } else if (origin === 'https://manage.casama.xyz') {
      setResearchHighlight(true)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
        (async function() {

          const casamaReverseRecord = await getReverseRecordForCasama(address);

          if(!casamaReverseRecord.length > 0) {

            const unstoppableDomainsReverseRecord = await getReverseRecordForUD(address);
            
            if (!unstoppableDomainsReverseRecord.length > 0) {

              const nameDisplayElement = document.getElementsByClassName('iekbcc0 ju367v8');
              const truncatedAddress = address.substring(0, 5) + '...' + address.substring(address.length - 4, address.length);
              nameDisplayElement[1].innerHTML = truncatedAddress;
            
            } else {

              const nameDisplayElement = document.getElementsByClassName('iekbcc0 ju367v8');
              nameDisplayElement[1].innerHTML = unstoppableDomainsReverseRecord;
            
            }
          } else {

            const nameDisplayElement = document.getElementsByClassName('iekbcc0 ju367v8');
            nameDisplayElement[1].innerHTML = casamaReverseRecord + '.casama';

          }
        })();
        
    }
  }, [isConnected, address])

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/register')){
      setHeaderTitle(pageHeaders['/register'].title)
      setHeaderDescription(pageHeaders['/register'].description)
    } else {
      setHeaderTitle(pageHeaders['/'].title)
      setHeaderDescription(pageHeaders['/'].description)
    }
  }, []);




return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center divide-x divide-slate-800 ">
                    <div className="flex-shrink-0 mr-2">
                      <a href="/">
                        <img
                            className="h-8"
                            src="/company_logos/casama_white_logo.png"
                            alt="The Ownership Company"
                          />
                      </a>
                    </div>
                    <div className='hidden md:flex'>
                    <a 
                      className={'text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium' + 
                      (applyHighlight ? ' bg-gray-700' : '')
                      } 
                    href='https://app.casama.xyz'>
                        Apply to Campaigns
                      </a>
                      <a className='text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium' href='https://airtable.com/shriTmlEfnBNJVcqH'>
                        Create a Listing
                      </a>
                      <a 
                        className={'text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium' + 
                          (researchHighlight ? ' bg-gray-700' : '')
                        } href='https://manage.casama.xyz'>
                        Researcher Portal
                      </a>
                    </div> 
                  </div>
                  <ConnectButton />
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  <div className='flex flex-col'>
                    <a className='text-gray-300 hover:text-white px-2 py-2 rounded-md text-md font-medium' href='https://app.casama.xyz'>
                        Apply to Campaigns
                      </a>
                      <a className='text-gray-300 hover:text-white px-2 py-2 rounded-md text-md font-medium' href='https://airtable.com/shriTmlEfnBNJVcqH'>
                        Create a Listing
                      </a>
                      <a className='text-gray-300 hover:text-white px-2 py-2 rounded-md text-md font-medium' href='https://manage.casama.xyz'>
                        Researcher Portal
                      </a>
                    </div>
                    
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div className="pt-4">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className='flex flex-col sm:flex-row justify-between'>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{headerTitle}</h1>
              </div>
              <div>
                <p className='text-md text-gray-500 font-medium'>{headerDescription}</p>
              </div>
            </div>
          </header>
        </div>
      </div>
      
    </>
)}