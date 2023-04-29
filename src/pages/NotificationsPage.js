import {useDispatch, useSelector} from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import {Navigate} from "react-router-dom";
import {isAuth, isAuthError} from "../redux/slices/auth";
import {useEffect, useState} from "react";
import {fetchMeProjects} from "../redux/slices/projects";

export default function NotificationsPage() {
    const dispatch = useDispatch();

    const IsAuthError = useSelector(isAuthError)
    const {data} = useSelector(({auth}) => auth);
    // const {notifications} = useSelector(({projects}) => projects);
    const IsNotificationsLoaded = true//useSelector(isMeProjectsLoaded);
    const IsAuth = useSelector(isAuth);

    const [notifications, setNotifications] = useState([{
        user: {
            user_avatar: '', first_name: 'sdfsd', last_name: 'sdfsdf'
        }, text: 'dsdsfdsfjdsfjjsdkfjkdsf'
    }, {
        user: {
            user_avatar: '', first_name: 'sqwwqwqdfsd', last_name: 'sdfwqwqwqsdf'
        }, text: 'dsdsfdsfjdsdfdkjsdkfjssjkdkldsfdkflkdfkdfljkdfsfjjsdkfjkdsf'
    }])

    useEffect(() => window.scrollTo(0, 0), [])

    useEffect(() => {
        if (IsAuth && !IsNotificationsLoaded) dispatch(fetchMeProjects(data.user.username))
    }, [IsAuth])

    if (!window.localStorage.getItem("token_refresh") || IsAuthError) return <Navigate to='/login'/>

    return (<div style={{width: '100%'}}>
        {IsNotificationsLoaded ? notifications.map((notification, index) => <section className="main-container"
                                                                                     key={index}>
            <div className="team-vacancy-card">
                <div style={{display: 'flex', justifyContent: 'space-between', margin: -10, marginBottom: 5}}>
                    {notification?.user &&
                        <div style={{display: 'flex', marginTop: -10, overflow: 'hidden', flexWrap: 'wrap'}}>
                            <div className="user-image" style={{width: 50, paddingBottom: 40, marginRight: -10}}>
                                <img
                                    style={{padding: 0, height: 30, width: 30}}
                                    src={notification.user.user_avatar ? notification.user.user_avatar.replace('/', '')
                                        .replace('http:/api.collabdev.ru/', '').replace('http:/127.0.0.1:8000/', '')
                                        .replace('%3A', ':/') : 'https://cdn.discordapp.com/attachments/803259316420214796/1038238060007145553/depositphotos_119670466-stock-illustration-user-icon-vector-male-person.webp'}
                                    alt="User avatar"/>
                            </div>
                            <div style={{
                                lineHeight: '30px',
                                color: "#999",
                                marginTop: 5,
                                marginRight: 40,
                                overflow: 'hidden',
                                marginLeft: 10
                            }}>
                                {notification.user.first_name + ' ' + notification.user.last_name}
                            </div>
                        </div>}
                </div>
                <div className='team-vacancy-card-description'>{notification.text}</div>
                <div style={{display: 'flex', gap: '2%'}}>
                    <button className="button-submit">Принять</button>
                    <button className="button-not-submit">Отклонить</button>
                </div>
            </div>
        </section>) : Array(3).fill({}).map((_, index) => <section
            className="main-container" key={index}>
            <div className="skeleton-vacancy-card">
                <Skeleton
                    variant="rectangular"
                    height={265}
                    style={{background: '#262626'}}
                />
            </div>
        </section>)}
    </div>);
}
