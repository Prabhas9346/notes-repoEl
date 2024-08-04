import Popup from 'reactjs-popup';
import Note from '../Note';

import 'reactjs-popup/dist/index.css';

const NoteModal = (props) => {
    const { note, onUpdate } = props;
    console.log(onUpdate);
    return (
        <div className="popup-container">
            <Popup
                modal
                trigger={
                    <div className="trigger-button">
                        <Note note={note} onUpdate={onUpdate} />
                    </div>
                }
            >
                {(close) => (
                    <>
                        <div onBlur={onUpdate}>
                            <Note note={note} onUpdate={onUpdate} />
                        </div>
                        <button
                            type="button"
                            className="trigger-button"
                            onClick={() => close()}
                        >
                            Close
                        </button>
                    </>
                )}
            </Popup>
        </div>
    );
};
export default NoteModal;
