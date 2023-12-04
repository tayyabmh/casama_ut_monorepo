const regExRulesToBlock = [
    // Regular expression to identify whether an email starts with jaki and end with goatmail.uk
    '^jaki.*goatmail.uk$',
    // Block all emails that start with ud.pfp
    '^ud.pfp',
    // Regular express to identify whether an email ends in "hi2.in"
    '.*hi2.in$'
];

export default function blacklistByEmail(email) {
    if (email) {
        return regExRulesToBlock.some((rule) => {
            const regEx = new RegExp(rule);
            return regEx.test(email);
        });
    }
}