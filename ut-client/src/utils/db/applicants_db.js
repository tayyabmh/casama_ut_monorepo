import Airtable from "airtable";

const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);


export function getApplicantsForCampaign(campaignId, callback) {
    base('new_inquiries_table').select({
        filterByFormula: `{campaign_id} = '${campaignId}'`,
    }).eachPage(function page(records, fetchNextPage) {
        callback(records);
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

export function approveApplicant(applicationId, callback) {
    base('new_inquiries_table').update(applicationId, {
                "client_selection_status": "Approved"
    }, function(err, record) {
        callback(record);
        if (err) {
            console.error(err);
            return;
        }
    });
}

export function disqualifyApplicant(applicationId, callback) {
    base('new_inquiries_table').update(applicationId, {
        "client_selection_status": "Disqualified"
    }, function(err, record) {
        callback(record);
        if (err) {
            console.error(err);
            return;
        }
    })
}