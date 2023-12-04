export default function IfNoApplicants() {
    return(
        <div className='col-span-1 px-2'>
            <h2 className='text-xl font-semibold mb-2'>Applicants</h2>
            <img src="/empty-folder.png" alt="Empty Folder" className='w-1/2 mx-auto' />
            <p className='text-center text-gray-8500'>Looks like no applications have come in, just yet.</p>
        </div>
    )
}