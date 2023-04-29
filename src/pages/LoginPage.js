import React, {useEffect, useState} from 'react';
import {Navigate, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {fetchAuth, isAuth} from "../redux/slices/auth";

export default function LoginPage() {
    const dispath = useDispatch();

    const IsAuth = useSelector(isAuth);

    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const {
        register, handleSubmit,
    } = useForm({
        defaultValues: {
            email: "", password: "",
        }, node: "onChange",
    });

    const onSubmit = async (values) => {
        setLoading(true)
        setError('')
        const {payload} = await dispath(fetchAuth(values))
        setLoading(false)
        !payload?.user && setError('Неверный логин или пароль')
        if ("access" in payload) {
            window.localStorage.setItem("token", payload.access)
            window.localStorage.setItem("token_refresh", payload.refresh)
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    if (IsAuth) return <Navigate to='/profile'/>

    return (<div className='main-container'>
        <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Вход CollabDev</h1>
            <div className={isFocused1 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="email">E-Mail</label>
                <input className="registration-form__input"
                       {...register("email", {required: "Укажите почту"})}
                       onFocus={() => setIsFocused1(true)}
                       onBlur={() => setIsFocused1(false)}
                       type="email" id="email"
                />
            </div>
            <div className={isFocused2 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="password">Пароль</label>
                <input className="registration-form__input"
                       {...register("password", {required: "Укажите пароль"})}
                       onFocus={() => setIsFocused2(true)}
                       onBlur={() => setIsFocused2(false)}
                       type="password" id="password"
                />
            </div>
            <div style={{height: 20, color: 'red', marginTop: -5, marginBottom: -15}}>{error}</div>
            <button className="button-submit" type="submit">
                {loading ? 'Загрузка...' : 'Войти'}</button>
            <Link to='/register' className="register-link">
                Зарегистрироваться
            </Link>
        </form>
    </div>);
}
