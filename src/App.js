import {useEffect, useState, useRef} from "react";
import {Routes, Route, Link} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {disableBodyScroll, enableBodyScroll} from "body-scroll-lock";

import {fetchAllSkills, fetchAllTypes} from "./redux/slices/projects"
import ButtonBar from "./components/ButtonBar";
import MenuIcon from "./icons/menu";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import AddProjectPage from "./pages/AddProjectPage";
import UserProfilePage from "./pages/UserProfilePage";
import {fetchAuthMe} from "./redux/slices/auth";
import LoginPage from "./pages/LoginPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import FullProjectPage from "./pages/FullProjectPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
    const dispatch = useDispatch();
    const popupRef = useRef(null)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeBar, setActiveBar] = useState(false)
    const [activeLeftBar, setActiveLeftBar] = useState(windowWidth > 880)
    const [activeAbsoluteLeftBar, setActiveAbsoluteLeftBar] = useState(false)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLeftBar = () => {
        // setActiveBar(a => !a);
        if (windowWidth > 880) {
            setActiveLeftBar(a => !a)
        } else {
            setActiveAbsoluteLeftBar(a => !a)
            activeAbsoluteLeftBar ? enableBodyScroll(popupRef.current) : disableBodyScroll(popupRef.current)
        }
    }

    useEffect(() => {
        setActiveLeftBar(windowWidth > 880)
        if (windowWidth > 880) {
            setActiveAbsoluteLeftBar(false)
            enableBodyScroll(popupRef.current)
        }
    }, [windowWidth]);

    useEffect(async () => {
        const {payload} = await dispatch(fetchAuthMe());
        dispatch(fetchAllTypes());
        dispatch(fetchAllSkills());
        window.localStorage.setItem("token", payload.access);
        window.localStorage.setItem("token_refresh", payload.refresh);
    }, []);

    return (<div className='App' ref={popupRef}>
        <header className={activeBar ? 'active-header' : ''}>

            <div className='header-container'>
                <div className='left-header-container'>
                    <div className='menu-left' onClick={handleLeftBar}>
                        <MenuIcon color='#fff'/>
                    </div>
                    <Link to='/' onClick={() => setActiveBar(false)}>
                        <div className='logo'>CollabDev</div>
                    </Link>
                </div>
                <div className='main-header-container'></div>
                <div className='right-header-container'></div>
            </div>

            {/*<div className={activeBar ? 'top-active-mobile-buttons' : 'top-mobile-buttons'}>*/}
            {/*    <div style={{width: 200}}>*/}
            {/*        <Link to='/' onClick={() => setActiveBar(a => !a)}>*/}
            {/*            <ButtonBar name='HomeIcon' text='Предложения'/>*/}
            {/*        </Link>*/}
            {/*        <Link to='/profile' onClick={() => setActiveBar(a => !a)}>*/}
            {/*            <ButtonBar name='ProfileIcon' text='Профиль'/>*/}
            {/*        </Link>*/}
            {/*        <Link to='/my-projects' onClick={() => setActiveBar(a => !a)}>*/}
            {/*            <ButtonBar name='TeamsIcon' text='Мои проекты'/>*/}
            {/*        </Link>*/}
            {/*        <Link to='/notifications' onClick={() => setActiveBar(a => !a)}>*/}
            {/*            <ButtonBar name='Notifications' text='Оповещения'/>*/}
            {/*        </Link>*/}
            {/*        <Link to='/add-project' onClick={() => setActiveBar(a => !a)}>*/}
            {/*            <ButtonBar name='AddProject' text='Создать проект'/>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </header>

        <main className='main'>

            <div style={{minWidth: activeLeftBar ? 200 : 55}} className='left-bar'>
                <div className='left-bar-container' style={{position: 'fixed'}}>
                    <Link to='/'>
                        <ButtonBar name='HomeIcon' text='Предложения' active={activeLeftBar}/>
                    </Link>
                    <Link to='/my-projects'>
                        <ButtonBar name='TeamsIcon' text='Мои проекты' active={activeLeftBar}/>
                    </Link>
                    <Link to='/profile'>
                        <ButtonBar name='ProfileIcon' text='Профиль' active={activeLeftBar}/>
                    </Link>
                    <Link to='/notifications'>
                        <ButtonBar name='Notifications' text='Оповещения' active={activeLeftBar}/>
                    </Link>
                    <Link to='/add-project'>
                        <ButtonBar name='AddProject' text='Создать проект' active={activeLeftBar}/>
                    </Link>
                </div>
            </div>

            <div style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                top: 0,
                background: '#000',
                zIndex: 1500,
                pointerEvents: activeAbsoluteLeftBar ? '' : 'none',
                opacity: activeAbsoluteLeftBar ? 0.5 : 0,
                transition: 'opacity .1s linear'
            }} onClick={handleLeftBar}/>

            <div style={{
                position: 'fixed',
                width: activeAbsoluteLeftBar ? 210 : 0,
                height: '100vh',
                top: 0,
                background: '#171717',
                zIndex: 2000,
                transition: 'width .1s linear',
            }}>

                <div className='header-container'>
                    <div className='left-header-container'>
                        <div className='menu-left' onClick={handleLeftBar}>
                            <MenuIcon color='#fff'/>
                        </div>
                        <Link to='/' onClick={() => {
                            setActiveBar(false)
                            setActiveAbsoluteLeftBar(false)
                            enableBodyScroll(popupRef.current)
                        }}>
                            <div className='logo'>CollabDev</div>
                        </Link>
                    </div>
                </div>

                <div className='left-bar-container'>
                    <Link to='/' onClick={handleLeftBar}>
                        <ButtonBar name='HomeIcon' text='Предложения'/>
                    </Link>
                    <Link to='/my-projects' onClick={handleLeftBar}>
                        <ButtonBar name='TeamsIcon' text='Мои проекты'/>
                    </Link>
                    <Link to='/profile' onClick={handleLeftBar}>
                        <ButtonBar name='ProfileIcon' text='Профиль'/>
                    </Link>
                    <Link to='/notifications' onClick={handleLeftBar}>
                        <ButtonBar name='Notifications' text='Оповещения'/>
                    </Link>
                    <Link to='/add-project' onClick={handleLeftBar}>
                        <ButtonBar name='AddProject' text='Создать проект'/>
                    </Link>
                </div>

            </div>

            <div className='main-right-container'>
                <Routes>
                    <Route path="/" exact element={<HomePage/>}/>
                    <Route path="/:username" element={<UserProfilePage/>}/>
                    <Route path="/profile" element={<UserProfilePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/my-projects" element={<MyTeamsPage/>}/>
                    <Route path="/notifications" element={<NotificationsPage/>}/>
                    <Route path="/add-project" element={<AddProjectPage/>}/>
                    <Route path="/edit-project/:id" element={<AddProjectPage/>}/>
                    <Route path="/project/:id" element={<FullProjectPage/>}/>
                </Routes>
            </div>

        </main>
    </div>);
}

export default App;


