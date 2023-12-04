export default function UnstoppableDomainsOnly(props) {
    return (
        <div className='mt-20 p-6'>
            <img src='https://gateway.pinata.cloud/ipfs/QmZSkpBmH4g2qe8BTQmxiG4x4TV9smALnDRuwFyFAWqngQ' alt='UD-logo' className='mx-auto h-24 w-auto' />
            {/* Display two different messages, one for UD holder applying to non-UD opportunity and then the reverse */}
            {(props.unstoppableDomainsOnly && !props.isUDHolder ? 
                <h4 className='text-center text-md font-normal text-gray-900 mt-8'>
                    This opportunity is only available to Unstoppable Domains users. If you have an Unstoppable Domain, ensure your 
                    <a href="https://support.unstoppabledomains.com/support/solutions/articles/48001217257-reverse-resolution" target="_blank" rel="noreferrer" className='text-blue-500 underline'> reverse resolution</a> is set to your wallet address.
                </h4>
                :
                (!props.UnstoppableDomainsOnly && props.isUDHolder ?
                <h4 className='text-center text-md font-normal text-gray-900 mt-8'>
                    This opportunity is only available for users who do not have an Unstoppable Domains account. Please apply for the study intended for Unstoppable Domains users. 
                </h4>
                : null)
            )}
            
        </div>
    )
}