import {useDispatch, useSelector} from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import {Navigate} from "react-router-dom";
import {isAuth, isAuthError} from "../redux/slices/auth";
import {useEffect, useState} from "react";
import {fetchMeProjects} from "../redux/slices/projects";
import {fetchNotifications, fetchUpdateNotifications, isNotificationsLoaded} from "../redux/slices/notifications";
import Notification from "../components/Notification";

export default function NotificationsPage() {
    const dispatch = useDispatch();

    const IsAuthError = useSelector(isAuthError)
    const IsNotificationsLoaded = useSelector(isNotificationsLoaded)
    const {data} = useSelector(({auth}) => auth);
    const {notifications} = useSelector(({notifications}) => notifications);
    const IsAuth = useSelector(isAuth);

    useEffect(() => {
        if (data?.user) {
            dispatch(fetchNotifications(data.user.id))
            window.scrollTo(0, 0)
        }
    }, [data?.user])

    useEffect(() => {
        if (IsAuth && !IsNotificationsLoaded) dispatch(fetchMeProjects(data.user.username))
    }, [IsAuth])

    if (!window.localStorage.getItem("token_refresh") || IsAuthError) return <Navigate to='/login'/>

    return (<div style={{width: '100%'}}>
        {IsNotificationsLoaded ? notifications.items.map((notification, index) => <section className="main-container"
                                                                                           key={index}>
            <Notification notification={notification}/>
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
