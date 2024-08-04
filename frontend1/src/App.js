import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Notes from './components/Notes';
import ArchievedNotes from './components/ArchievedNotes';
import TrashedNotes from './components/TrashedNotes';
import SideBar from './components/SideBar';
import { getJwtToken } from './components/utils/auth';
import EditLabels from './components/EditLabels';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogedIn: false,
            toggleSlideBar: false,
            filterString: '',
        };
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = () => {
        const token = getJwtToken();
        if (token !== undefined) {
            this.setState({ isLogedIn: true });
        }
    };

    toggleHeaderFn = () => {
        this.setState({ isLogedIn: false });
    };

    toggleBtn = () => {
        const token = getJwtToken();
        if (token !== undefined) {
            this.setState((prevState) => ({
                toggleSlideBar: !prevState.toggleSlideBar,
            }));
        }
        console.log('clicked');
    };

    filterfn = (string) => {
        this.setState({ filterString: string });
    };

    render() {
        const { isLogedIn, toggleSlideBar, filterString } = this.state;
        return (
            <BrowserRouter>
                <Main
                    isLogedIn={isLogedIn}
                    toggleSlideBar={toggleSlideBar}
                    toggleBtn={this.toggleBtn}
                    toggleHeaderFn={this.toggleHeaderFn}
                    filterString={filterString}
                    filterfn={this.filterfn}
                />
            </BrowserRouter>
        );
    }
}

const Main = ({
    isLogedIn,
    toggleSlideBar,
    toggleBtn,
    toggleHeaderFn,
    filterString,
    filterfn,
}) => {
    const location = useLocation();

    const shouldShowHeaderAndSidebar =
        location.pathname !== '/' && location.pathname !== '/SignUp';

    return (
        <>
            {shouldShowHeaderAndSidebar && (
                <Header filterfn={filterfn} toggleBtn={toggleBtn} />
            )}
            <div className="page-body">
                {toggleSlideBar && shouldShowHeaderAndSidebar && <SideBar />}
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/Notes/:label?"
                            element={<Notes filterString={filterString} />}
                        />
                        <Route path="/EditLabels" element={<EditLabels />} />
                        <Route
                            path="/Archieved"
                            element={
                                <ArchievedNotes filterString={filterString} />
                            }
                        />
                        <Route
                            path="/Trashed"
                            element={
                                <TrashedNotes filterString={filterString} />
                            }
                        />
                    </Route>
                </Routes>
            </div>
        </>
    );
};

export default App;
