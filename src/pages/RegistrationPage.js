import React, {useEffect, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {fetchRegister, isAuth} from "../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";

export default function RegistrationPage() {
    const IsAuth = useSelector(isAuth);
    const dispath = useDispatch();

    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [isFocused7, setIsFocused7] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const {
        register, handleSubmit
    } = useForm({
        defaultValues: {
            first_name: "", last_name: "", username: "", birth_date: "", email: "", password1: "", password2: "",
        }, node: "onChange",
    });

    const onSubmit = async (values) => {
        if (values.password1 !== values.password2) setError('Пароли не совпадают')
        if (values.password1.length < 8) {
            setError('Короткий пароль')
        } else {
            setLoading(true)
            const {payload} = await dispath(fetchRegister(values));
            setLoading(false)
            !payload?.user && alert("Не удалось авторизоваться");
            if ("access" in payload) {
                window.localStorage.setItem("token", payload.access)
                window.localStorage.setItem("token_refresh", payload.refresh)
            }
        }
    };

    useEffect(() => window.scrollTo(0, 0), [])

    if (IsAuth) return <Navigate to='/profile'/>

    return (<div className="main-container">
        <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Создание CollabDevID</h1>
            <div className={isFocused1 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="first_name">Имя:</label>
                <input className="registration-form__input"
                       {...register("first_name", {required: "Укажите ваше имя"})}
                       onFocus={() => setIsFocused1(true)}
                       onBlur={() => setIsFocused1(false)}
                       type="text" id="first_name"/>
            </div>
            <div className={isFocused2 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="last_name">Фамилия:</label>
                <input className="registration-form__input"
                       {...register("last_name", {required: "Укажите вашу фамилию"})}
                       onFocus={() => setIsFocused2(true)}
                       onBlur={() => setIsFocused2(false)}
                       type="text" id="last_name"/>
            </div>
            <div className={isFocused3 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="username">Логин:</label>
                <input className="registration-form__input"
                       {...register("username", {required: "Укажите ваш логин"})}
                       onFocus={() => setIsFocused3(true)}
                       onBlur={() => setIsFocused3(false)}
                       type="text" id="username"/>
            </div>
            <div className={isFocused4 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="birth_date">Дата рождения:</label>
                <input className="registration-form__input"
                       {...register("birth_date", {required: "Укажите дату рождения"})}
                       onFocus={() => setIsFocused4(true)}
                       onBlur={() => setIsFocused4(false)}
                       type="date" id="birth_date"/>
            </div>
            <div className={isFocused5 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="email">Email:</label>
                <input className="registration-form__input"
                       {...register("email", {required: "Укажите почту"})}
                       onFocus={() => setIsFocused5(true)}
                       onBlur={() => setIsFocused5(false)}
                       type="email" id="email"/>
            </div>
            <div className={isFocused6 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="password1">Пароль:</label>
                <input className="registration-form__input"
                       {...register("password1", {required: "Укажите пароль"})}
                       onFocus={() => setIsFocused6(true)}
                       onBlur={() => setIsFocused6(false)}
                       type="password" id="password1"/>
            </div>
            <div className={isFocused7 ? "active-registration-form__group" : "registration-form__group"}>
                <label className="registration-form__label" htmlFor="password2">Повторный пароль:</label>
                <input className="registration-form__input"
                       {...register("password2", {required: "Укажите пароль"})}
                       onFocus={() => setIsFocused7(true)}
                       onBlur={() => setIsFocused7(false)}
                       type="password" id="password2"/>
            </div>
            <div style={{height: 20, color: 'red', marginTop: -5, marginBottom: -15}}>{error}</div>
            <button className="button-submit" type="submit">
                {loading ? 'Загрузка...' : 'Зарегистрироваться'}</button>
            <Link to='/login' className="register-link">
                Войти
            </Link>
        </form>
    </div>);
}
