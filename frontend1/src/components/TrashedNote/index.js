import React, { Component } from 'react';
import './index.css';
import { getJwtToken, BASE_URL } from '../utils/auth';

class TrashedNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: props.note.backgroundColor,
            title: props.note.title,
            description: props.note.description,
        };
    }

    handleRestore = async () => {
        const { id } = this.props.note;
        console.log(id);

        const token = getJwtToken();
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isTrashed: false }),
        };

        try {
            const response = await fetch(
                `${BASE_URL}/notes/trash/${id}`,
                options
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error:', errorText);
                return;
            }

            console.log('Note restored successfully');
            this.props.onUpdate();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleDeletePermanently = async () => {
        const { id } = this.props.note;

        const token = getJwtToken();
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(`${BASE_URL}/notes/${id}`, options);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error:', errorText);
                return;
            }

            console.log('Note deleted permanently');
            this.props.onUpdate();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    render() {
        const { note } = this.props;
        const { createdAt, updatedAt } = note || {}; // Ensure `note` is defined
        const { backgroundColor, title, description } = this.state;

        // Format dates to IST
        const formattedCreatedAt = new Date(createdAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
        });
        const formattedUpdatedAt = new Date(updatedAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
        });

        return (
            <li className="note" style={{ backgroundColor }}>
                <div className="note-header">
                    <h2 className="note-title">{title}</h2>
                </div>
                <div className="note-description-container">
                    <p className="note-description">{description}</p>
                </div>
                <div className="note-footer">
                    <span className="note-date">
                        Created: {formattedCreatedAt}
                    </span>
                    <span className="note-date">
                        Updated: {formattedUpdatedAt}
                    </span>
                </div>
                <div className="note-actions">
                    <button
                        className=" delete-Btns"
                        onClick={this.handleRestore}
                    >
                        Restore
                    </button>
                    <button
                        className=" delete-Btns"
                        onClick={this.handleDeletePermanently}
                    >
                        Delete Permanently
                    </button>
                </div>
            </li>
        );
    }
}

export default TrashedNote;
