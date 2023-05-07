import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {declOfDate} from "../utils/utils";
import ButtonTop from "./ButtonBar";
import {useDispatch, useSelector} from "react-redux";
import slug from "slug"
import {deleteProject, fetchDeleteProject} from "../redux/slices/projects";
import {fetchPostNotifications} from "../redux/slices/notifications";

export default function TeamVacancyCard(props) {
    const {data} = useSelector(({auth}) => auth);

    const dispatch = useDispatch();

    const modalRef = useRef(null);

    const [button, setButton] = useState(true)
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(true)
    const [createTime, setCreateTime] = useState('');
    const [activeOptions, setActiveOptions] = useState(false);
    const [writeText, setWriteText] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [text, setText] = useState('')

    const handleOutsideClick = (e) => (modalRef.current && !modalRef.current.contains(e.target)) && setActiveOptions(false);

    const handleDelete = () => dispatch(fetchDeleteProject(props.id)).finally(dispatch(deleteProject(props.id)))

    const handlePostNotification = () => {
        setLoading(true)
    }

    useEffect(() => {
        loading && dispatch(fetchPostNotifications({...props, text})).finally(() => {
            setLoading(false);
            setActive(false)
        })
    }, [loading])

    useEffect(() => {
        data?.user && props.users.map((item) => {
            item.id === data.user.id && setButton(false)
        })
    }, [data?.user]);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(() => setCreateTime(declOfDate(props.created_at)), [props.date]);

    return (<div className="team-vacancy-card">
        <div style={{display: 'flex', justifyContent: 'space-between', margin: -10, marginBottom: 5}}>
            {props?.user && <Link to={`/@${props.user.username}`} state={props.user}
                                  style={{display: 'flex', marginTop: -10, overflow: 'hidden', flexWrap: 'wrap'}}>
                <div className="user-image" style={{width: 50, paddingBottom: 40, marginRight: -10}}>
                    <img
                        style={{padding: 0, height: 30, width: 30}}
                        src={props.user.user_avatar ? props.user.user_avatar.replace('/', '')
                            .replace('http:/api.collabdev.ru/', '').replace('http:/127.0.0.1:8000/', '')
                            .replace('%3A', ':/') : 'https://cdn.discordapp.com/attachments/803259316420214796/1038238060007145553/depositphotos_119670466-stock-illustration-user-icon-vector-male-person.webp'}
                        alt="User avatar"/>
                </div>
                <div style={{
                    lineHeight: '30px', color: "#999", marginTop: 5, marginRight: 40, overflow: 'hidden', marginLeft: 10
                }}>
                    {props.user.first_name + ' ' + props.user.last_name}
                </div>
            </Link>}

            {props.user?.username === data?.user.username && <div style={{height: 20, width: 0, zIndex: 1}}>
                {!activeOptions ?
                    <div style={{position: 'relative', right: 45}} onClick={() => setActiveOptions(s => !s)}>
                        <ButtonTop name='Options'/>
                    </div> : <div>
                        <div ref={modalRef} style={{
                            display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', width: 95, marginLeft: -95
                        }}>
                            <Link to={`/edit-project/${props.id}-${slug(props.title)}`}
                                  state={props}
                                  style={{
                                      width: '100%',
                                      textAlign: 'center',
                                      color: '#fff',
                                      margin: 0,
                                      cursor: "pointer",
                                      padding: 10,
                                      borderTopLeftRadius: 10,
                                      borderTopRightRadius: 10
                                  }} className="option-btn">
                                Изменить
                            </Link>

                            <div
                                onClick={handleDelete}
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    color: '#fff',
                                    margin: 0,
                                    cursor: "pointer",
                                    padding: 10,
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10
                                }} className="option-btn">
                                Удалить
                            </div>
                        </div>
                    </div>}
            </div>}
        </div>

        <div className="team-vacancy-card-title">
            <Link to={`/project/${props.id}-${slug(props.title)}`} state={{
                ...props, users: [props.user],
            }}>
                <h2>{props.title}</h2>
            </Link>
        </div>

        <p className="team-vacancy-card-description">{props.description}</p>
        <ul className="team-vacancy-card-stack-list">
            {props.skills.map((item, index) => (<li className="team-vacancy-card-stack-item" key={index}>{item}</li>))}
        </ul>
        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10}}>
            <div className="team-vacancy-card-type"
                 style={{
                     color: props.project_type === 'Хакатон' ? '#EDDC49' : props.project_type === 'Пет-проект' ? '#197603' : ''
                 }}>
                #{props.project_type}
            </div>
            <div className="team-vacancy-card-type" style={{textAlign: 'right', pointerEvents: 'none'}}>
                {createTime}
            </div>
        </div>

        {!writeText && button && <div onClick={() => setWriteText(true)}
                        style={{height: 40}}
                        className={"button-submit"}>{'Откликнуться'}</div>}

        {writeText && <div>
            {active && <div className={isFocused ? "active-registration-form__group" : "registration-form__group"}>
                        <textarea className="registration-form__input"
                                  onFocus={() => setIsFocused(true)}
                                  onBlur={() => setIsFocused(false)}
                                  id="description" value={text}
                                  onChange={e => setText(e.target.value)}
                                  style={{
                                      paddingTop: 9,
                                      borderRadius: 10,
                                      resize: 'none',
                                      fontFamily: 'inherit',
                                      fontSize: 'inherit',
                                      height: 200
                                  }}
                                  placeholder='Сопроводительное сообщение'
                                  autoFocus/>
            </div>}

            {button && <div onClick={() => active && handlePostNotification()}
                            style={{height: 40}}
                            className={active ? "button-submit" : 'button-not-submit not-active'}>{loading ? 'Загрузка...' : active ? 'Отправить' : 'Запрос отправлен'}</div>}
        </div>}
    </div>);
}
