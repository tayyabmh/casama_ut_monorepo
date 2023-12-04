import Airtable from "airtable";


const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);

export const getAllOrganizationCampaigns = (auth0_organization_id, callback) => {
    base('Campaigns_test').select({
        filterByFormula: `{org_id} = '${[auth0_organization_id]}'`,
    }).eachPage(function page(records, fetchNextPage) {
        callback(records);
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

export function getCampaignInformation(campaignId, callback) {
    base('Campaigns_test').find(campaignId, function(err, record) {
        if (err) { console.error(err); return; }
        callback(record);
    });
}

export function changeCampaignStatus(campaignId, status, callback) {
    base('Campaigns_test').update(campaignId, {
        "status": status
    }, function(err, record) {
        callback(record);
        if (err) { console.error(err); return; }
    });
}