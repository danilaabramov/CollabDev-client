import TeamVacancyCard from "../components/TeamVacancyCard";
import {useDispatch, useSelector} from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import {Navigate} from "react-router-dom";
import {isAuth, isAuthError} from "../redux/slices/auth";
import {useEffect} from "react";
import {fetchMeProjects, isMeProjectsLoaded} from "../redux/slices/projects";

export default function MyTeamsPage() {
    const dispatch = useDispatch();

    const IsAuthError = useSelector(isAuthError)
    const {data} = useSelector(({auth}) => auth);
    const {meProjects} = useSelector(({projects}) => projects);
    const IsMeProjectsLoaded = useSelector(isMeProjectsLoaded);
    const IsAuth = useSelector(isAuth);

    useEffect(() => window.scrollTo(0, 0), [])

    useEffect(() => {
        if (IsAuth && !IsMeProjectsLoaded) dispatch(fetchMeProjects(data.user.username))
    }, [IsAuth])

    if (!window.localStorage.getItem("token_refresh") || IsAuthError) return <Navigate to='/login'/>

    return (<div style={{width: '100%'}}>
        {IsMeProjectsLoaded ? meProjects.items.map((project, index) => <section className="main-container" key={project.id}>
            <TeamVacancyCard
                user={project?.users[0]}
                {...project}
            />
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
