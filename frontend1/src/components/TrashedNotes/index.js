import { useEffect, useState, useCallback } from 'react';
import TrashedNote from '../TrashedNote';
import './index.css';
import { getJwtToken, BASE_URL } from '../utils/auth';

const TrashedNotes = (props) => {
    const [notes, setNotes] = useState([]);
    const { filterString } = props;

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

        const url = `${BASE_URL}/notes/Trashed`;

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
    }, [filterString]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div className="notesEls">
            <ul className="notesElListsdisplay">
                {notes.map((note) => (
                    <TrashedNote
                        key={note.id}
                        note={note}
                        onUpdate={fetchNotes}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TrashedNotes;
