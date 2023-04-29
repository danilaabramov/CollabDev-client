export default function Menu({color}) {
    return (<svg width="25" height="25" viewBox="0 0 25 25">
            <rect x="0" y="5" width="20" height="2" fill={color}/>
            <rect x="0" y="12" width="20" height="2" fill={color}/>
            <rect x="0" y="19" width="20" height="2" fill={color}/>
        </svg>);
}
