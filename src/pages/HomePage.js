import TeamVacancyCard from "../components/TeamVacancyCard";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllProjects, isProjectsLoaded} from "../redux/slices/projects";
import Skeleton from "@mui/material/Skeleton";
import {useEffect} from "react";

export default function HomePage() {
    const dispatch = useDispatch();

    const IsProjectsLoaded = useSelector(isProjectsLoaded);
    const {projects} = useSelector(({projects}) => projects);

    useEffect(() => {
        window.scrollTo(0, 0);
        !IsProjectsLoaded && dispatch(fetchAllProjects());
    }, [])

    return (<div style={{width: '100%'}}>
        {IsProjectsLoaded ? projects.items
            .map((project, index) => <section className="main-container" key={project.id}>
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
