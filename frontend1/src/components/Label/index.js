import './index.css';
import { Link } from 'react-router-dom';
import { MdOutlineLabel } from 'react-icons/md';

const Label = (props) => {
    const { label, active, handleClick } = props;
    const { name } = label;

    return (
        <li>
            <Link to={`/Notes/${name}`}>
                <button
                    onClick={handleClick}
                    className={`listItem ${active ? 'addColortoBtn' : ''}`}
                >
                    <MdOutlineLabel className="itemsLogo" />
                    <p className="itemstext">{name}</p>
                </button>
            </Link>
        </li>
    );
};

export default Label;
