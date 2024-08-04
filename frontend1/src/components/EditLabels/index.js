import { Component } from 'react';
import { getJwtToken } from '../utils/auth';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BASE_URL } from '../utils/auth';
import './index.css';

class EditLabels extends Component {
    state = { labels: [], error: '' };

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

    deleteLabel = async (id) => {
        const token = getJwtToken();
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const url = `${BASE_URL}/labels/${id}`;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorText = await response.text();
                this.setState({ error: errorText });
                console.log('Error:', errorText);
                return;
            }

            const Reciveddata = await response.text();
            this.fetchLabels();

            console.log(Reciveddata);
        } catch (error) {
            this.setState({
                error: 'An error occurred while deleting the label',
            });
            console.log('Error:', error);
        }
    };

    render() {
        const { labels } = this.state;
        return (
            <div className="notesEls">
                <ul className="editNoteLablesList">
                    {labels.map((ele) => (
                        <li key={ele.id}>
                            <div className="labelsEditBox">
                                <p>{ele.name}</p>
                                <button
                                    className="DeletelabelBtn"
                                    onClick={() => this.deleteLabel(ele.id)}
                                >
                                    <FaRegTrashAlt className="labeldeleteIcon" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default EditLabels;
