import {useEffect, useState} from "react";
import {fetchUpdateNotifications} from "../redux/slices/notifications";
import {useDispatch} from "react-redux";

export default function Notification({notification}) {
    const dispatch = useDispatch();

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)

    useEffect(() => {
        const asyncFun = async () => {
            const {payload} = await dispatch(fetchUpdateNotifications({
                id: notification.id,
                status: 2
            }))
            payload && setLoading1(false)
        }
        loading1 && asyncFun()
    }, [loading1])

    useEffect(() => {
        const asyncFun = async () => {
            const {payload} = await dispatch(fetchUpdateNotifications({
                id: notification.id,
                status: 3
            }))
            payload && setLoading1(false)
        }
        loading2 && asyncFun()
    }, [loading2])


    return (<div className="team-vacancy-card">
        <div style={{display: 'flex', justifyContent: 'space-between', margin: -10, marginBottom: 5}}>
            {notification?.request_user &&
                <div style={{display: 'flex', marginTop: -10, overflow: 'hidden', flexWrap: 'wrap'}}>
                    <div className="user-image" style={{width: 50, paddingBottom: 40, marginRight: -10}}>
                        <img
                            style={{padding: 0, height: 30, width: 30}}
                            src={notification.request_user.user_avatar ? notification.request_user.user_avatar.replace('/', '')
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
                        {notification.request_user.first_name + ' ' + notification.request_user.last_name}
                    </div>
                </div>}
        </div>
        <div className='team-vacancy-card-description'>{notification.text}</div>
        <div style={{display: 'flex', gap: '2%'}}>
            <button className="button-submit"
                    style={{height: 60}}
                    onClick={() => {!loading1 && !loading2 &&  setLoading1(true)
                    }}>{loading1 ? "Загрузка..." : "Принять"}
            </button>
            <button className="button-not-submit"
                    style={{height: 60}}
                    onClick={() => {!loading1 && !loading2 &&  setLoading2(true)
                    }}>{loading2 ? "Загрузка..." : "Отклонить"}
            </button>
        </div>
    </div>)
}