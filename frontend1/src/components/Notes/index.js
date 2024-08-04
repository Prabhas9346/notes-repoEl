import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Note from '../Note';
import './index.css';
import { getJwtToken, BASE_URL } from '../utils/auth';

const Notes = (props) => {
    const { label } = useParams();
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteDescription, setNewNoteDescription] = useState('');
    const [newNoteColor, setNewNoteColor] = useState('#ffffff');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const navigate = useNavigate();
    const { filterString } = props;

    const fetchNotes = useCallback(async () => {
        console.log(filterString);
        const token = getJwtToken();
        if (!token) {
            navigate('/');
            return;
        }

        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        const url = label
            ? `${BASE_URL}/notes?label=${label}`
            : `${BASE_URL}/notes/`;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error:', errorText);
                return;
            }

            const receivedData = await response.json();
            const filteredData = receivedData.filter(
                (ele) =>
                    ele.title
                        .toLowerCase()
                        .includes(filterString.toLowerCase()) ||
                    ele.description
                        .toLowerCase()
                        .includes(filterString.toLowerCase())
            );
            setNotes(filteredData);
            console.log(receivedData);
        } catch (error) {
            console.log('Error:', error);
        }
    }, [label, navigate, filterString]);

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
        if (!token) {
            navigate('/');
            return;
        }

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
            const response = await fetch(`${BASE_URL}/notes/`, options);
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error:', errorText);
                return;
            }
            fetchNotes(); // Refresh notes list
        } catch (error) {
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
                    <Note key={note.id} note={note} onUpdate={fetchNotes} />
                ))}
            </ul>
        </div>
    );
};

export default Notes;
