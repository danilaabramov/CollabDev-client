export default function Options({isHovered, color, colorHover}) {
    return (<svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM17 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
            fill={isHovered ? colorHover : color}
        />
    </svg>)
}
