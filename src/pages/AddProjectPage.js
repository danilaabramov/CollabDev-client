import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from 'react'
import {
    fetchCreateProject, fetchOneProject, fetchUpdateProject, isSkillsLoaded, isTypesLoaded
} from "../redux/slices/projects";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import {isAuthError} from "../redux/slices/auth";
import Skeleton from "@mui/material/Skeleton";
import slug from "slug";

export default function AddProjectPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();

    const {id} = useParams();

    const IsAuthError = useSelector(isAuthError)
    const IsTypesLoaded = useSelector(isTypesLoaded)
    const {data} = useSelector(({auth}) => auth);

    const {types, skills} = useSelector(({projects}) => projects);
    const [isFocused1, setIsFocused1] = useState(false)
    const [isFocused2, setIsFocused2] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [project, setProject] = useState()
    const [activeType, setIActiveType] = useState(0)
    const [title, setTitle] = useState('')
    const [addSkills, setAddSkills] = useState([])
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (IsTypesLoaded && (location.state || project)) {
            let Data = project ? project : location.state
            if (data?.user.username && Data?.users[0] ? Data.users
                .filter((item) => item.username === data.user.username).length : false) {
                setIActiveType(types.items.map((item, index) => item.title === Data.project_type ? index : false)
                    .filter(item => item !== false)[0])
                setTitle(Data.title)
                setAddSkills(Data.skills)
                setDescription(Data.description)
            } else navigate('/')
        }
    }, [IsTypesLoaded, project])

    useEffect(() => {
        const asyncFun = async () => {
            const {payload} = await dispatch(fetchOneProject(id.split('-')[0]));
            payload?.id ? window.location.pathname !== "/add-project" && setProject(payload) : navigate('/')
        }
        window.scrollTo(0, 0);
        window.history.replaceState({}, document.title)
        id && !location.state && asyncFun()
    }, [])

    useEffect(() => {
        if (window.location.pathname === "/add-project") {
            setIActiveType(0)
            setTitle('')
            setAddSkills([])
            setDescription('')
        }
    }, [location])

    const handlePostChange = async () => {
        setLoading(true)
        if (location.state) {
            dispatch(fetchUpdateProject({
                id: location.state.id,
                title,
                description,
                skills: addSkills,
                soft_delete: false,
                project_type: types.items[activeType].title
            })).finally(() => {
                setLoading(false)
                navigate(`/projects/${location.state.id}`)
            })
        } else {
            dispatch(fetchCreateProject({
                title, description, skills: addSkills, soft_delete: false, project_type: types.items[activeType].title
            })).finally(() => {
                setLoading(false)
                navigate(`/`)
            })
        }
    };

    const handleAddSkill = (item) => {
        if (addSkills.indexOf(item) < 0) {
            setAddSkills([...addSkills, item])
            setSearchTerm('')
        }
    };

    if (!window.localStorage.getItem("token_refresh") || IsAuthError) return <Navigate to='/login'/>

    if (window.location.pathname !== "/add-project" && project && (id !== project?.id + "-" + slug(project?.title))) return <Navigate
        to={`/edit-project/${project?.id}-${slug(project?.title)}`}/>

    return (<div className="main-container">
        {(!id || id && (location.state || project)) ? <form className="team-vacancy-card">
            <div className={isFocused1 ? "active-registration-form__group" : "registration-form__group"}>
                <input className="registration-form__input"
                       onFocus={() => setIsFocused1(true)}
                       onBlur={() => setIsFocused1(false)}
                       type="text" id="title" value={title}
                       onChange={e => setTitle(e.target.value)}
                       style={{paddingTop: 9, borderRadius: 10, fontSize: 20, fontWeight: 'bold'}}
                       placeholder='Название'
                       autoFocus/>
            </div>

            <ul className="team-vacancy-card-stack-list">
                <li>Тип проекта:</li>
                {IsTypesLoaded && types.items.map((item, index) => <li className='team-vacancy-card-type'
                                                                       key={index}
                                                                       style={{
                                                                           color: activeType === index ? '#1341D4' : '',
                                                                           textDecoration: activeType === index ? 'underline' : ''
                                                                       }}
                                                                       onClick={() => setIActiveType(index)}>#{item.title}
                </li>)}
            </ul>

            <div className={isFocused2 ? "active-registration-form__group" : "registration-form__group"}>
                        <textarea className="registration-form__input"
                                  onFocus={() => setIsFocused2(true)}
                                  onBlur={() => setIsFocused2(false)}
                                  id="description" value={description}
                                  onChange={e => setDescription(e.target.value)}
                                  style={{
                                      paddingTop: 9,
                                      borderRadius: 10,
                                      resize: 'none',
                                      fontFamily: 'inherit',
                                      fontSize: 'inherit',
                                      height: 200
                                  }}
                                  placeholder='Описание'
                                  autoFocus/>
            </div>

            <ul className="team-vacancy-card-stack-list">
                {addSkills.map((item, index) => (<li className="team-vacancy-card-stack-item" key={index}
                                                     onClick={() => setAddSkills(s => s.filter(n => n !== item))}>- {item}</li>))}
            </ul>

            <div className={isFocused ? "active-registration-form__group" : "registration-form__group"}
                 style={{margin: 0, position: 'relative'}}>
                <input className="registration-form__input"
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => {
                           setIsFocused(false)
                       }}
                       type="text" value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       style={{paddingTop: 9, borderRadius: 10, height: 25}}
                       placeholder='Начните искать навык, например, git'
                />
            </div>
            {isSkillsLoaded && skills.items.filter(item => item.title.toLowerCase()
                .includes(searchTerm.toLowerCase())).length && searchTerm ? <ul className="team-vacancy-card-stack-list"
                                                                                style={{
                                                                                    backgroundColor: '#1B1B1C',
                                                                                    gap: 0,
                                                                                    margin: '-5px 0 0',
                                                                                    borderBottomRightRadius: 10,
                                                                                    borderBottomLeftRadius: 10,
                                                                                    paddingTop: 5
                                                                                }}>
                {skills.items.filter(item => item.title.toLowerCase()
                    .includes(searchTerm.toLowerCase())).slice(0, 10).map((item, index) => <li
                    className="add-project-stack-item" key={index} style={{borderRadius: 9}}
                    onClick={() => handleAddSkill(item.title)}>{item.title}</li>)}
            </ul> : null}
            <div className="button-submit" onClick={handlePostChange} style={{
                width: 'calc(100% - 20px)', textAlign: 'center', lineHeight: '50px', height: 50
            }}>
                {loading ? 'Загрузка...' : id ? 'Сохранить' : 'Создать проект'}
            </div>
        </form> : <section className="main-container">
            <div className="skeleton-vacancy-card">
                <Skeleton
                    variant="rectangular"
                    height={610}
                    style={{background: '#262626'}}
                />
            </div>
        </section>}
    </div>)
}
