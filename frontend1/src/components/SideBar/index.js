import './index.css';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { MdLightbulbOutline } from 'react-icons/md';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RiInboxArchiveLine } from 'react-icons/ri';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LiaBell } from 'react-icons/lia';
import { getJwtToken, BASE_URL } from '../utils/auth';

import Label from '../Label';

class SideBar extends Component {
    state = {
        labels: [],
        error: '',
        activeButton: 0, // Add state for active button
    };

    componentDidMount() {
        this.fetchLabels();
    }

    fetchLabels = async () => {
        const token = getJwtToken();
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await fetch(`${BASE_URL}/labels/`, options);

            if (!response.ok) {
                const errorText = await response.text();
                this.setState({ error: errorText });
                console.log('Error:', errorText);
                return;
            }

            const Reciveddata = await response.json();
            this.setState({ labels: Reciveddata, error: '' });
            console.log(Reciveddata);
        } catch (error) {
            this.setState({ error: 'An error occurred while fetching labels' });
            console.log('Error:', error);
        }
    };

    handleButtonClick = (index) => {
        this.setState({ activeButton: index }, this.render);
    };

    render() {
        const { labels, error, activeButton } = this.state;

        return (
            <nav className="navBarEl">
                <ul className="sideBarList">
                    <li>
                        <Link to="/notes">
                            <button
                                onClick={() => this.handleButtonClick(0)}
                                className={`listItem ${
                                    activeButton === 0 ? 'addColortoBtn' : ''
                                }`}
                            >
                                <MdLightbulbOutline className="itemsLogo" />
                                <p className="itemstext">Notes</p>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => this.handleButtonClick(1)}
                            className={`listItem ${
                                activeButton === 1 ? 'addColortoBtn' : ''
                            }`}
                        >
                            <LiaBell className="itemsLogo" />
                            <p className="itemstext">Remainders</p>
                        </button>
                    </li>

                    {labels.map((label, index) => (
                        <Label
                            key={label.id}
                            label={label}
                            active={activeButton === index + 2}
                            handleClick={() =>
                                this.handleButtonClick(index + 2)
                            }
                        />
                    ))}

                    <li>
                        <Link to="/EditLabels">
                            <button
                                onClick={() =>
                                    this.handleButtonClick(labels.length + 2)
                                }
                                className={`listItem ${
                                    activeButton === labels.length + 2
                                        ? 'addColortoBtn'
                                        : ''
                                }`}
                            >
                                <MdOutlineModeEdit className="itemsLogo" />
                                <p className="itemstext">Edit</p>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Archieved">
                            <button
                                onClick={() =>
                                    this.handleButtonClick(labels.length + 3)
                                }
                                className={`listItem ${
                                    activeButton === labels.length + 3
                                        ? 'addColortoBtn'
                                        : ''
                                }`}
                            >
                                <RiInboxArchiveLine className="itemsLogo" />
                                <p className="itemstext">Archieve</p>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/Trashed">
                            <button
                                onClick={() =>
                                    this.handleButtonClick(labels.length + 4)
                                }
                                className={`listItem ${
                                    activeButton === labels.length + 4
                                        ? 'addColortoBtn'
                                        : ''
                                }`}
                            >
                                <FaRegTrashAlt className="itemsLogo" />
                                <p className="itemstext">Trash</p>
                            </button>
                        </Link>
                    </li>
                </ul>
                {error && <div className="error">{error}</div>}
            </nav>
        );
    }
}

export default SideBar;
