import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {isAuth, isAuthError, logout} from "../redux/slices/auth";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import {clearProjects, fetchMeProjects, fetchUserProjects, isMeProjectsLoaded} from "../redux/slices/projects";
import {declOfNum} from "../utils/utils";
import TeamVacancyCard from "../components/TeamVacancyCard";

export default function UserProfilePage() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const {username} = useParams();

    const {data} = useSelector(({auth}) => auth);
    const {meProjects} = useSelector(({projects}) => projects);
    const IsAuthError = useSelector(isAuthError)
    const IsMeProjectsLoaded = useSelector(isMeProjectsLoaded);
    const IsAuth = useSelector(isAuth);

    const [activeTab, setActiveTab] = useState(1)
    const [userData, setUserData] = useState()

    const onClickLogout = () => {
        if (window.confirm("Вы действительно хотите выйти?")) {
            dispatch(logout())
            dispatch(clearProjects())
            window.localStorage.removeItem("token_refresh")
            navigate('/login')
        }
    };

    useEffect(() => IsAuth && !IsMeProjectsLoaded && dispatch(fetchMeProjects(data.user.username)), [IsAuth])

    useEffect(() => {
        window.scrollTo(0, 0);
        window.history.replaceState({}, document.title)
        location?.state && setUserData(location?.state)
    }, [])

    useEffect(() => {
        const asyncFun = async () => {
            const {payload} = await dispatch(fetchUserProjects(username.slice(1, username.length)))
            if (payload?.username) {
                setUserData({
                    ...payload, projects: payload.projects.reverse()
                })
            } else navigate('/')
        }
        if (username && username.slice(1, username.length) === data?.user.username) {
            setUserData({
                ...data.user, projects: meProjects.items ? meProjects.items : data.user.projects
            })
        } else if (username) asyncFun()
    }, [username, meProjects.items])

    if (!username && (!window.localStorage.getItem("token_refresh") || IsAuthError)) return <Navigate to='/login'/>

    if (!username && data?.user) return <Navigate to={`/@${data?.user.username}`}/>

    if(username && username[0] !== '@') return <Navigate to='/'/>

    return (<div className="main-container">
        {userData ? <div className="user-profile">
            {username.slice(1, username.length) === data?.user.username &&
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <div onClick={onClickLogout} className="register-link"
                         style={{textAlign: 'right', color: 'red', margin: 0, cursor: "pointer"}}>
                        Выйти
                    </div>
                </div>}
            <section className="user-info">
                <div className="user-image">
                    <img
                        src={userData?.user_avatar ? userData.user_avatar.replace('/', '')
                            .replace('http:/api.collabdev.ru/', '').replace('http:/127.0.0.1:8000/', '')
                            .replace('%3A', ':/') : 'https://cdn.discordapp.com/attachments/803259316420214796/1038238060007145553/depositphotos_119670466-stock-illustration-user-icon-vector-male-person.webp'}
                        alt="User avatar"/>
                </div>
                <div className="user-details">
                    <h2>{userData.first_name + ' ' + userData.last_name}</h2>
                    <h3>{userData.username}</h3>
                    <div className="user-stats">
                        {/*<div>*/}
                        {/*    <strong>{userData.followers}</strong> Подписчиков*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <strong>{userData.following}</strong> Подписок*/}
                        {/*</div>*/}
                        <div style={{display: 'flex'}}>
                            <strong>{declOfNum(userData.projects?.length, [' проект', ' проекта', ' проектов'])}</strong>
                        </div>
                    </div>
                </div>
            </section>
            <div style={{display: 'flex', gap: 20}}>
                <div className={activeTab === 0 ? "user-tab-active" : "user-tab"} onClick={() => {
                    setActiveTab(0)
                }}>
                    О себе
                </div>
                <div className={activeTab === 1 ? "user-tab-active" : "user-tab"} onClick={() => {
                    setActiveTab(1)
                }}>
                    Проекты
                </div>
            </div>
            {activeTab === 1 ? <div style={{width: '100%'}}>
                {userData?.projects[0]?.title ? userData.projects
                    .map((project, index) => <section className="main-container" key={index}>
                        <TeamVacancyCard
                            user={project?.users[0]}
                            {...project}
                        />
                    </section>) : !userData?.projects.length ? <></> : Array(3).fill({}).map((_, index) => <section
                    className="main-container" key={index}>
                    <div className="skeleton-vacancy-card">
                        <Skeleton
                            variant="rectangular"
                            height={265}
                            style={{background: '#262626'}}
                        />
                    </div>
                </section>)}
            </div> : <></>}
        </div> : <section className="main-container">
            <div className="skeleton-vacancy-card">
                <Skeleton
                    variant="rectangular"
                    height={1000}
                    style={{background: '#262626'}}
                />
            </div>
        </section>}
    </div>);
}
