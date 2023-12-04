import React, { useState, useEffect } from "react";
import { useSignMessage, useAccount } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';
import OnboardingValidationNotification from "./validation_errors";
import JSConfetti from 'js-confetti';
import { useNavigate  } from "react-router-dom";
import { SuccessfulMint } from "./successful_mint";



import {
    validateCommHandle,
    getWalletIfExists,
    getCasamaIDIfExists,
    mintProfileNFT,
    addProfileToAirtable,
    blacklistByEmail
} from './onboard_helpers';

const jsConfetti = new JSConfetti();



const timezones = [
    "(GMT -12:00) Eniwetok, Kwajalein",
    "(GMT -11:00) Midway Island, Samoa",
    "(GMT -10:00) Hawaii",
    "(GMT -9:30) Taiohae",
    "(GMT -9:00) Alaska",
    "(GMT -8:00) Pacific Time (US & Canada)",
    "(GMT -7:00) Mountain Time (US & Canada)",
    "(GMT -6:00) Central Time (US & Canada), Mexico City",
    "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima",
    "(GMT -4:30) Caracas",
    "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz",
    "(GMT -3:30) Newfoundland",
    "(GMT -3:00) Brazil, Buenos Aires, Georgetown",
    "(GMT -2:00) Mid-Atlantic",
    "(GMT -1:00) Azores, Cape Verde Islands",
    "(GMT + 0) Western Europe Time, London, Lisbon, Casablanca",
    "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris",
    "(GMT +2:00) Kaliningrad, South Africa",
    "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg",
    "(GMT +3:30) Tehran",
    "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi",
    "(GMT +4:30) Kabul",
    "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent",
    "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi",
    "(GMT +5:45) Kathmandu, Pokhara",
    "(GMT +6:00) Almaty, Dhaka, Colombo",
    "(GMT +6:30) Yangon, Mandalay",
    "(GMT +7:00) Bangkok, Hanoi, Jakarta",
    "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong",
    "(GMT +8:45) Eucla",
    "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk",
    "(GMT +9:30) Adelaide, Darwin",
    "(GMT +10:00) Eastern Australia, Guam, Vladivostok",
    "(GMT +10:30) Lord Howe Island",
    "(GMT +11:00) Magadan, Solomon Islands, New Caledonia",
    "(GMT +11:30) Norfolk Island",
    "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka",
    "(GMT +12:45) Chatham Islands",
    "(GMT +13:00) Apia, Nukualofa",
    "(GMT +14:00) Line Islands, Tokelau"
]


export default function Onboarding() {
    const [ preferredComm, setPreferredComm ] = useState("Email");
    const [ commHandle, setCommHandle ] = useState("");
    const [ verifiedWallet, setVerifiedWallet ] = useState('');
    const [ verifiedCheck, setVerifiedCheck ] = useState(false);
    const [ verifyFailed, setVerifyFailed ] = useState(false);
    const [ timezone, setTimezone ] = useState("(GMT + 0) Western Europe Time, London, Lisbon, Casablanca");
    const [ validationErrors, setValidationErrors ] = useState([]);
    const [ showSuccessModal, setShowSuccessModal ] = useState(false);
    const [ username, setUsername ] = useState("");
    const [ showValidationErrorNotification, setShowValidationErrorNotification]  = useState(false);
    const [ isRegistering, setIsRegistering ] = useState(false);
    const [ isVerifying, setIsVerifying] = useState(false);
    const [ tooShort, setTooShort ] = useState(false);
    const [ meetsHomoglyphRequirements, setMeetsHomoglyphRequirements ] = useState(true);
    const [ consent, setConsent ] = useState(false);

    const { isConnected, address } = useAccount();
    const navigate = useNavigate();

    const { signMessage } = useSignMessage({
        onSuccess(data, variables) {
            const verifiedAddress = verifyMessage(variables.message, data);
            if (verifiedAddress === address) {
                setVerifiedWallet(address);
                setVerifiedCheck(true);
            } else {
                setVerifyFailed(true);
            }
        }
    })

    useEffect(() => {
        if (username.length > 0) {
            const regex = new RegExp("^[a-z0-9][a-z0-9-_]{0,15}$");
            setMeetsHomoglyphRequirements(regex.test(username));
        }

        if (username.length < 3 && username.length > 0) {
            setTooShort(true);
        } else {
            setTooShort(false);
        }
    }, [username])

    const handleSignMessage = () => {
        const message = "Sign this message to verify your ownership of this wallet.";
        signMessage({ message });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        performValidation(verifiedWallet, preferredComm, commHandle, username)
        .then(async () => {
            setIsVerifying(false);
            setIsRegistering(true);
            // First mint the NFT, if successful, then update the Airtable
            await mintProfileNFT(username, verifiedWallet);

            // Add new user to Airtable
            await addProfileToAirtable(username, verifiedWallet, preferredComm, commHandle, timezone);
        }).then(() => {
            setIsRegistering(false);
            setShowSuccessModal(true);
            jsConfetti.addConfetti({
                confettiColors: [
                    '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
                ],
            })
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 5000);
        })
        .catch((errors) => {
            setIsVerifying(false);

            if (errors.length > 0) {
                setValidationErrors(errors);
                setShowValidationErrorNotification(true);
                setTimeout(() => {
                    setShowValidationErrorNotification(false);
                    setValidationErrors([]);
                }, 6000);
            } else {
                setValidationErrors(["Whoops! This is embarassing, something went wrong and we aren't sure what. Reach out to us over email/telegram and we'll get you sorted out!"]);
                setShowValidationErrorNotification(true);
                setTimeout(() => {
                    setShowValidationErrorNotification(false);
                    setValidationErrors([]);
                }, 6000);
            }

            
            
        });
        
    }

    const performValidation = (address, preferredComm, commHandle, username) => {
        return new Promise( async (resolve, reject) => {
            let errors = [];

            const wallet = await getWalletIfExists(address);
            if (wallet.length > 0) {
                errors.push("This wallet is already registered. You do not need to register again.");
            }

            const casamaID = await getCasamaIDIfExists(username);
            if (casamaID.length > 0) {
                errors.push("This Casama ID is already taken, please try another.");
            }

            if (!validateCommHandle(preferredComm, commHandle)) {
                errors.push("Either your email or telegram handle is invalid. Please check and try again. (Telegram handles should start with @)");
            }

            if (blacklistByEmail(commHandle)) {
                errors.push("There was an unexpected error. Please try again later.");
            }
            
            if (errors.length > 0) {
                reject(errors);
            }
            else {
                resolve();
            }
        })
    }

    return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4'>
        <SuccessfulMint show={showSuccessModal}/>
        <div >
        <form className="space-y-8 w-3/4 md:w-1/2 lg:w-1/2 justify-center mx-auto">
            <div className="space-y-6 mt-4">
                <div>
                    <h3 className="text-3xl font-medium leading-6 text-gray-900">
                        Casama Registration
                    </h3>
                </div>
                <div>
                    <label htmlFor="wallet-verification" className="block text-md font-medium text-gray-700">
                        Wallet Verification
                    </label>
                    <p className="text-sm text-gray-500">
                        We need to verify your wallet address to ensure you are the rightful owner of the wallet.
                    </p>
                    <button
                        type="button"
                        className="disabled:bg-slate-500 my-4 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        onClick={handleSignMessage}
                        disabled={!isConnected}
                    >
                        {isConnected ? "Click here to prove ownership of your wallet" : "Connect your wallet to begin"}
                    </button>
                    {verifiedCheck ? 
                        <div className="flex flex-row py-1">
                            <CheckIcon className="w-6 h-6 text-green-700"/> 
                            <p className="text-green-700 font-semibold text-md"> Your wallet has been verified.</p>
                        </div>
                        : null 
                    }
                    {verifyFailed ?
                        <div className="flex flex-row py-1">
                            <p className="text-red-700 font-semibold text-md"> Your wallet could not be verified.</p>
                        </div>
                        : null
                    }
                    <div className="mt-2">
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                            placeholder="0x..."
                            readOnly
                            aria-describedby="email-description"
                            value={verifiedWallet}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-md font-medium text-gray-700">
                        Username
                    </label>
                    <p className="text-sm text-gray-500" id="email-description">
                        Casama will mint a unique NFT for you. This username will be represented in your NFT.
                    </p>
                    <div className="mt-2 mb-4">
                        <input
                            type="text"
                            name="casama-id"
                            id="casama-id"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                            placeholder="Type your desired username here"
                            aria-describedby="email-description"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {tooShort && <p className='text-red-500 text-sm mt-1'>Name must be at least 3 characters</p>}
                        {!meetsHomoglyphRequirements && <p className='text-red-500 text-sm mt-1'>Allowed characters are a-z, A-Z, 0-9, -, and _ </p>}
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='mt-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
                                <path fill="url(#B)" d="M0 0h270v270H0z"/>
                                <defs>
                                    <filter id="A" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
                                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity=".225" width="200%" height="200%"/>
                                    </filter>
                                </defs>
                                <text x="10" y="40" fontSize="18" fill="#fff" filter="url(#A)" fontFamily="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" fontWeight="bold">Casama Name Service</text><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stopColor="#e90831"/><stop offset="1" stopColor="#8f0b75" stopOpacity=".99"/></linearGradient></defs><text x="32.5" y="231" fontSize="27" fill="#fff" filter="url(#A)" fontFamily="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" fontWeight="bold">
                                    {username}.casama
                                </text>
                            </svg>
                        </div>
                    </div>
                    
                </div>
                <div>
                    <label htmlFor="location" className="block text-md font-medium text-gray-700">
                        Preferred Method of Communication
                    </label>
                    <select
                        id="communication"
                        name="communication"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                        defaultValue="Email"
                        onChange={(e) => setPreferredComm(e.target.value)}
                    >
                        <option>Email</option>
                        <option>Telegram</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="email" className="block text-md font-medium text-gray-700">
                        Communication Handle
                    </label>
                    <p className="text-sm text-gray-500" id="email-description">
                        Help us identify you on your preferred communication method.
                    </p>
                    <div className="mt-1">
                        <input
                            type="email"
                            name="handle"
                            id="handle"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                            placeholder={preferredComm === "Email" ? "you@example.com" : "Your Telegram Handle"}
                            aria-describedby="email-description"
                            onChange={(e) => {
                                setCommHandle(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="timezone" className="block text-md font-medium text-gray-700">
                        Timezone
                    </label>
                    <select
                        id="timezone"
                        name="timezone"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                        defaultValue="(GMT + 0) Western Europe Time, London, Lisbon, Casablanca"
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        {timezones.map((timezone, index) => <option key={index}>{timezone}</option>)}
                    </select>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                <input
                    id="comments"
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    className="h-6 w-6 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    value={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                />
                </div>
                <div className="ml-3 text-md">
                <label htmlFor="comments" className="font-medium text-gray-700">
                    Consent to Communication
                </label>
                <p id="comments-description" className="text-gray-500">
                    By clicking this box, you consent to receive communication from Casama. You can unsubscribe at any time.
                </p>
                </div>
            </div>
            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="disabled:bg-slate-500 disabled:cursor-not-allowed ml-3 inline-flex justify-center rounded-md border border-transparent bg-rose-600 py-2 px-8 text-md font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        onClick={(e) => handleSubmit(e)}
                        disabled={!isConnected || !username || !commHandle || !timezone || tooShort || !meetsHomoglyphRequirements || !consent}
                    >
                        {isVerifying ? "Verifying..." :
                        (isRegistering ? "Registering...": "Register")}
                    </button>
                </div>
            </div>
        </form>
        </div>
        <OnboardingValidationNotification show={showValidationErrorNotification} errors={validationErrors} />
    </div>
    )
}