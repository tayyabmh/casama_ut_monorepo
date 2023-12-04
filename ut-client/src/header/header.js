import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'




export default function Header(props) {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [ headerTitle, setHeaderTitle ] = useState('')
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
    const path = window.location.pathname;
    if (path.includes('/applicants')) {
      setHeaderTitle('Campaign Applicants')
    } else {
      setHeaderTitle('Dashboard')
    }
  }, []);

  const handleLoginOrLogout = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin })
    } else {
      loginWithRedirect()
    }
  }

  

return (
    <>

      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-900">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between ">
                  <div className="flex items-center divide-x divide-slate-800">
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
                  <div className="hidden md:flex md:flex-row justify-between">
                    <div className="items-center">
                      
                        <button
                            onClick={() => handleLoginOrLogout()}
                            className="inline-block rounded-md border border-transparent bg-white py-1 px-4 text-base font-medium text-gray-800 hover:bg-indigo-50"
                        >
                            {!isAuthenticated ? 'Client Login' : 'Logout'}
                        </button>
                    </div>
                  </div>
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
                    <Disclosure.Button
                      key="2"
                      as="a"
                      className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                      onClick={() => handleLoginOrLogout()}
                    >
                        {!isAuthenticated ? 'Client Login' : 'Logout'}                 
                    </Disclosure.Button>
                    
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
            </div>
          </header>
        </div>
      </div>
    </>
)}