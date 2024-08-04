import React, { Component } from 'react';
import './index.css';
import { MdOutlineUnarchive } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { getJwtToken } from '../utils/auth';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { format } from 'date-fns-tz';

class ArchievedNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: props.note.backgroundColor,
            isColorPickerVisible: false,
            title: props.note.title,
            description: props.note.description,
            isArchived: props.note.isArchived,
            isTrashed: props.note.isTrashed,
            isLabelInputVisible: false, // Track visibility of label input
            newLabel: '', // Track the new label input
        };
        this.colorPickerRef = React.createRef();
        this.textAreaRef = React.createRef();
        this.labelInputRef = React.createRef(); // Reference for the label input
    }

    handleColorChange = (color) => {
        this.setState(
            { backgroundColor: color, isColorPickerVisible: false },
            this.updateNote
        );
    };

    handleArchive = () => {
        this.setState({ isArchived: false }, this.updateNote);
    };

    handleTrash = () => {
        this.setState({ isTrashed: true }, this.updateNote);
    };

    toggleColorPicker = () => {
        this.setState((prevState) => ({
            isColorPickerVisible: !prevState.isColorPickerVisible,
        }));
    };

    handleClickOutside = (event) => {
        if (
            this.colorPickerRef.current &&
            !this.colorPickerRef.current.contains(event.target)
        ) {
            this.setState({ isColorPickerVisible: false });
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.adjustTextAreaHeight();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.description !== this.state.description ||
            prevState.title !== this.state.title
        ) {
            this.adjustTextAreaHeight();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleBlur = () => {
        this.updateNote();
    };

    adjustTextAreaHeight = () => {
        if (this.textAreaRef.current) {
            this.textAreaRef.current.style.height = 'auto';
            this.textAreaRef.current.style.height = `${this.textAreaRef.current.scrollHeight}px`;
        }
    };

    updateNote = async () => {
        const { id } = this.props.note;
        const { backgroundColor, title, description, isArchived, isTrashed } =
            this.state;

        const token = getJwtToken();
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                backgroundColor,
                title,
                description,
                isArchived,
                isTrashed,
            }),
        };

        try {
            const response = await fetch(
                `https://aposanabackendnotes.onrender.com/notes/${id}`,
                options
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error:', errorText);
                return;
            }

            console.log('Note updated successfully');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    handleLabelInputChange = (e) => {
        this.setState({ newLabel: e.target.value });
    };

    handleAddLabel = async () => {
        const { newLabel } = this.state;
        const { id } = this.props.note;
        const token = getJwtToken();

        if (newLabel.trim()) {
            try {
                // Attempt to create the label
                let options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ label: newLabel }),
                };

                const response = await fetch(
                    `https://aposanabackendnotes.onrender.com/labels/`,
                    options
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.log('Error:', errorText);
                    return;
                }

                const labelData = await response.json();

                // Link the label to the note
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ labelId: labelData.id, noteId: id }),
                };

                const linkResponse = await fetch(
                    `https://aposanabackendnotes.onrender.com/labelnotes/`,
                    options
                );

                if (!linkResponse.ok) {
                    const errorText = await linkResponse.text();
                    console.log('Error:', errorText);
                    return;
                }

                console.log('Label linked to note successfully');
                this.setState({ newLabel: '', isLabelInputVisible: false }); // Reset state
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };

    toggleLabelInput = () => {
        this.setState(
            (prevState) => ({
                isLabelInputVisible: !prevState.isLabelInputVisible,
            }),
            () => {
                if (this.state.isLabelInputVisible) {
                    this.labelInputRef.current.focus();
                }
            }
        );
    };

    render() {
        const { note } = this.props;
        const { createdAt, updatedAt } = note || {}; // Ensure `note` is defined
        const {
            backgroundColor,
            isColorPickerVisible,
            title,
            description,
            isArchived,
            isTrashed,
            isLabelInputVisible,
            newLabel,
        } = this.state;

        if (!isArchived || isTrashed) {
            return null;
        }

        const colors = [
            '#ffffff',
            '#f28b82',
            '#fbbc04',
            '#fff475',
            '#ccff90',
            '#a7ffeb',
            '#cbf0f8',
            '#aecbfa',
            '#d7aefb',
            '#fdcfe8',
            '#e6c9a8',
            '#e8eaed',
        ];

        // Format dates to IST
        const formattedCreatedAt = format(
            new Date(createdAt),
            'yyyy-MM-dd HH:mm:ss',
            { timeZone: 'Asia/Kolkata' }
        );
        const formattedUpdatedAt = format(
            new Date(updatedAt),
            'yyyy-MM-dd HH:mm:ss',
            { timeZone: 'Asia/Kolkata' }
        );

        return (
            <li
                className="note"
                style={{ backgroundColor }}
                onBlur={this.handleBlur}
            >
                <div className="note-header">
                    <input
                        className="note-title"
                        value={title}
                        onChange={(e) =>
                            this.setState({ title: e.target.value })
                        }
                    />
                </div>
                <div className="note-description-container">
                    <textarea
                        className="note-description"
                        value={description}
                        onChange={(e) =>
                            this.setState({ description: e.target.value })
                        }
                        ref={this.textAreaRef}
                    />
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
                        className="functionBtns"
                        onClick={this.handleArchive}
                    >
                        <MdOutlineUnarchive />
                    </button>
                    <button className="functionBtns" onClick={this.handleTrash}>
                        <FaRegTrashAlt />
                    </button>
                    <button
                        className="functionBtns"
                        onClick={this.toggleColorPicker}
                    >
                        <IoColorPaletteOutline />
                    </button>
                    <button
                        className="functionBtns"
                        onClick={this.toggleLabelInput}
                    >
                        <BsThreeDotsVertical />
                    </button>
                </div>
                {isColorPickerVisible && (
                    <div
                        className="note-color-picker"
                        ref={this.colorPickerRef}
                    >
                        {colors.map((color) => (
                            <button
                                key={color}
                                className="color-button"
                                style={{ backgroundColor: color }}
                                onClick={() => this.handleColorChange(color)}
                            />
                        ))}
                    </div>
                )}
                {isLabelInputVisible && (
                    <div className="label-input-container">
                        <input
                            type="text"
                            value={newLabel}
                            onChange={this.handleLabelInputChange}
                            ref={this.labelInputRef}
                            placeholder="Enter label"
                        />
                        <button onClick={this.handleAddLabel}>Add</button>
                    </div>
                )}
            </li>
        );
    }
}

export default ArchievedNote;
