import TeamVacancyCard from "../components/TeamVacancyCard";
import {useDispatch, useSelector} from "react-redux";
import {fetchOneProject, isCustomProject, clearCustomProject} from "../redux/slices/projects";
import Skeleton from "@mui/material/Skeleton";
import {useLocation, useParams, Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import slug from "slug";

export default function FullProjectPage() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const {id} = useParams();

    const {data} = useSelector(({auth}) => auth);
    const {customProject} = useSelector(({projects}) => projects);
    const IsCustomProject = useSelector(isCustomProject);

    const [project, setProject] = useState()

    useEffect(() => {
        const asyncFn = async () => {
            const {payload} = await dispatch(fetchOneProject(id.split('-')[0]));
            if (payload?.id) {
                setProject(payload);
            } else navigate('/')
        }
        window.scrollTo(0, 0);
        window.history.replaceState({}, document.title)
        asyncFn()
    }, [])

    useEffect(() => {
        IsCustomProject && setProject(customProject.items)
        dispatch(clearCustomProject)
    }, [IsCustomProject])

    if (project && (id !== project?.id + "-" + slug(project?.title))) return <Navigate
        to={`/project/${project?.id}-${slug(project?.title)}`}/>

    if (!Number(id.split('-')[0])) return <Navigate to='/'/>

    return (<div style={{width: '100%'}}>
        {location.state || project ? [project ? project : location.state].map((project, index) => <section
            className="main-container" key={index}>
            <TeamVacancyCard
                custom={data?.user.username && project?.users[0] ? project.users
                    .filter((item) => item.username === data.user.username).length : false}
                {...project}
                user={project?.users[0]}

            />
        </section>) : <section className="main-container">
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
