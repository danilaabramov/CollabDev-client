export default function Notifications({isHovered, color, colorHover}) {
    return (<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"
                 style={{margin: '5px -4px 0 4px'}}>
        <path
            clipRule="evenodd"
            d="M9 1C5.444 1 3.667 3.507 3.667 6.6v1.733c0 1.105-.994 2.017-1.791 2.782A2.781 2.781 0 0 0 1 13.133C1 14.164 1.796 15 2.778 15h12.444c.982 0 1.778-.836 1.778-1.867 0-.826-.362-1.525-.876-2.018-.797-.765-1.79-1.677-1.79-2.782V6.6C14.333 3.507 12.555 1 9 1Z"
            stroke={isHovered ? colorHover : color}
            strokeWidth={2}
        />
        <path
            d="M11 18a2.183 2.183 0 0 1-.846.73A2.595 2.595 0 0 1 9 18.997c-.405 0-.803-.093-1.154-.267A2.184 2.184 0 0 1 7 18"
            stroke={isHovered ? colorHover : color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>)
}
