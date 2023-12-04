export const createFilterForORCampaignIds = (campaigns) => {
    let campaignChecks = campaigns.map(campaign => {
        return `{campaign_id} = '${campaign.id}'`;
    });
    const filter = "OR(" + campaignChecks.join(", ") + ")";
    return filter
}