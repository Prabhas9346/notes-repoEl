import { useEffect, useState, useCallback } from 'react';
import ArchievedNote from '../ArchievedNote';
import './index.css';
import { getJwtToken } from '../utils/auth';

const ArchievedNotes = () => {
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteDescription, setNewNoteDescription] = useState('');
    const [newNoteColor, setNewNoteColor] = useState('#ffffff');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [error, setError] = useState('');

    const fetchNotes = useCallback(async () => {
        const token = getJwtToken();
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const url = 'https://aposanabackendnotes.onrender.com/notes/Archieved';

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText);
                console.log('Error:', errorText);
                return;
            }

            const receivedData = await response.json();
            setNotes(receivedData);
            setError('');
            console.log(receivedData);
        } catch (error) {
            setError('An error occurred while fetching notes');
            console.log('Error:', error);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'newNoteTitle') setNewNoteTitle(value);
        if (name === 'newNoteDescription') setNewNoteDescription(value);
    };

    const handleColorChange = (color) => {
        setNewNoteColor(color);
        setIsColorPickerVisible(false);
    };

    const handleInputClick = () => {
        setIsTitleVisible(true);
    };

    const handleBlur = async (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            if (newNoteTitle || newNoteDescription) {
                await createNote();
            }
            setIsTitleVisible(false);
            setNewNoteTitle('');
            setNewNoteDescription('');
            setNewNoteColor('#ffffff');
        }
    };

    const createNote = async () => {
        const token = getJwtToken();
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: newNoteTitle,
                description: newNoteDescription,
                backgroundColor: newNoteColor,
            }),
        };

        try {
            const response = await fetch(
                'https://aposanabackendnotes.onrender.com/notes/',
                options
            );
            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText);
                console.log('Error:', errorText);
                return;
            }
            fetchNotes(); // Refresh notes list
        } catch (error) {
            setError('An error occurred while creating the note');
            console.log('Error:', error);
        }
    };

    const toggleColorPicker = () => {
        setIsColorPickerVisible((prevState) => !prevState);
    };

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

    return (
        <div className="notesEls">
            <div
                className="notesInputTextBox"
                onClick={handleInputClick}
                onBlur={handleBlur}
                tabIndex="0" // This makes the div focusable to capture blur event properly
            >
                <input
                    name="newNoteTitle"
                    value={newNoteTitle}
                    onChange={handleInputChange}
                    className="inputEl2"
                    type="text"
                    placeholder={isTitleVisible ? 'Title' : 'Take a note...'}
                />
                <textarea
                    name="newNoteDescription"
                    value={newNoteDescription}
                    onChange={handleInputChange}
                    className={`inputEl ${
                        isTitleVisible ? 'inputElDisplay' : ''
                    }`}
                    placeholder="Take a note..."
                ></textarea>
                <button
                    className="color-picker-button"
                    onClick={toggleColorPicker}
                >
                    Colors
                </button>
                {isColorPickerVisible && (
                    <div className="note-color-picker">
                        {colors.map((color) => (
                            <button
                                key={color}
                                className="color-button"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ul className="notesElListsdisplay">
                {notes.map((note) => (
                    <ArchievedNote
                        key={note.id}
                        note={note}
                        onUpdate={fetchNotes}
                    />
                ))}
            </ul>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ArchievedNotes;
