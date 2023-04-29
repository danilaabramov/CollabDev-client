import {useState} from 'react';
import HomeIcon from "../icons/home";
import ProfileIcon from "../icons/profile";
import ChatsIcon from "../icons/chats";
import TeamsIcon from "../icons/teams";
import AddProject from "../icons/add-project";
import Notifications from "../icons/notifications";
import Options from "../icons/options";

const iconMap = {
    'HomeIcon': HomeIcon,
    'ProfileIcon': ProfileIcon,
    'ChatsIcon': ChatsIcon,
    'TeamsIcon': TeamsIcon,
    'AddProject': AddProject,
    'Notifications': Notifications,
    'Options': Options
};

export default function ButtonBar({name, text, active = true}) {
    const [isHovered, setIsHovered] = useState(false);

    const Icon = iconMap[name];

    return (
        <div className='button-bar'
             style={{width: text && active ? 160 : 25}}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
            <div style={{width: 25, display: 'flex'}}>
                <Icon isHovered={isHovered} color='#fff' colorHover='#175BDD'/>
            </div>
            <div className='text-button-bar'>
                <div className='text-container-button-bar'>
                    {text}
                </div>
            </div>
        </div>
    );
}
