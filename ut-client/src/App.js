import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { ProtectedRoute } from './utils/protectedRoute';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import Airtable from 'airtable';

import Header from './header/header';

// Component imports
import ClientDashboard from './pages/client/dashboard/dashboard';
import Applicants from './pages/client/applicants/applicants';


import { getAllOrganizationCampaigns } from './utils/db/campaign_db';
import { createFilterForORCampaignIds } from './utils/airtableFilterFunctions';

const auth0_namespace = process.env.REACT_APP_AUTH0_NAMESPACE;
const STATUS_ORDER = ["Active", "Inactive", "Complete"];

const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);



function App() {
  const { user, isAuthenticated } = useAuth0();
  const [ campaigns, setCampaigns ] = useState([]);
  const [ applications, setApplications ] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      getAllOrganizationCampaigns(user[auth0_namespace + '/org_id'], (records) => {
        const sortedRecords = records.sort((a, b) => { return STATUS_ORDER.indexOf(a.fields.status) - STATUS_ORDER.indexOf(b.fields.status) });
        setCampaigns(sortedRecords);
      }, function done(err) {
        if (err) { console.error(err); return; }
      })
  }
  }, [user, isAuthenticated]);


  useEffect(() => {
    const filter = createFilterForORCampaignIds(campaigns);
    base("new_inquiries_table").select({
        filterByFormula: filter
    }).eachPage(function page(records, fetchNextPage) {
        setApplications(records);
        fetchNextPage();
    });
}, [campaigns]);

  return (
    <div className="App">
      <Header />      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute
              component={ClientDashboard}
              campaigns={campaigns} 
              setCampaigns={setCampaigns}
              applications={applications}
              setApplications={setApplications}
            />
          } />
          <Route path="/applicants/:campaignId" element={<ProtectedRoute component={Applicants} campaigns={campaigns}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
