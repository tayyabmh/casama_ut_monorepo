export default function Campaign_StatusPill(props) {
    return (
        <span className={"inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium max-w-fit " + statusColors(props.status).bg_text}>
            <svg className={"-ml-1 mr-1.5 h-2 w-2 " + statusColors(props.status).circle } fill="currentColor" viewBox="0 0 8 8">
                <circle cx={4} cy={4} r={3} />
            </svg>
            {props.status}
        </span>
    )
}


function statusColors(status) {
    switch(status) {
        case "Active":
            return {
                bg_text: "bg-green-100 text-green-800",
                circle: "text-green-400"
            };
        case "Inactive":
            return {
                bg_text: "bg-red-100 text-red-800",
                circle: "text-red-400"
            };
        case "Complete":
            return {
                bg_text: "bg-blue-100 text-blue-800",
                circle: "text-blue-400"
            };
        default:
            return {
                bg_text: "bg-gray-100 text-gray-800",
                circle: "text-gray-400"
            };
    }
}