const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
const cron = require('node-cron');
app.use(cors());
const dbpath = path.join(__dirname, 'keepNotes.db');
let db = null;
const initializedb = async () => {
    try {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database,
        });
        app.listen(8000, () => {
            console.log('server is running in http://localhost:8000');
        });
    } catch (error) {
        console.log(`unable to run the server due to ${error.message}`);
    }
};
initializedb();
const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers['authorization'];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send('Invalid JWT Token');
    } else {
        jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
            if (error) {
                response.status(401);
                response.send('Invalid JWT Token');
            } else {
                request.username = payload.username;
                next();
            }
        });
    }
};

const deleteOldNotes = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    const deleteOldNotesQuery = `
        DELETE FROM notes 
        WHERE createdAt < '${formattedDate}';
    `;
    await db.run(deleteOldNotesQuery);
    console.log('Deleted old notes successfully');
};

// Schedule the cleanup task
cron.schedule('0 0 * * *', async () => {
    try {
        await deleteOldNotes();
    } catch (error) {
        console.error('Error deleting old notes:', error);
    }
});

app.post('/SignUp/', async (request, response) => {
    console.log('entered signUp');
    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const selectUserQuery = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        const createUserQuery = `
        INSERT INTO 
          users (username,email, password) 
        VALUES 
          (
            '${username}', 
            '${email}',
            '${hashedPassword}'
            
          )`;
        await db.run(createUserQuery);
        response.send(`User created successfully`);
    } else {
        response.status(400);
        response.send('User already exists');
    }
});

//User Login API
app.post('/SignIn/', async (request, response) => {
    console.log('enetered sigIn');
    const { username, password } = request.body;
    const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        response.status(400);
        response.send('Invalid User');
    } else {
        const isPasswordMatched = await bcrypt.compare(
            password,
            dbUser.password
        );
        if (isPasswordMatched === true) {
            const payload = {
                username: username,
            };
            const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
            response.send({ jwtToken });
        } else {
            response.status(400);
            response.send('Invalid Password');
        }
    }
});
app.get('/labels/', authenticateToken, async (request, response) => {
    const { username } = request;
    console.log(username);
    const getLabelsQuery = `
          SELECT
            labels.*
        FROM
            labels
        INNER JOIN
            notelabels ON labels.id = notelabels.labelId
        INNER JOIN
            notes ON notelabels.noteId = notes.id
        INNER JOIN
            users ON notes.userId=users.id
        WHERE
            users.username = '${username}'
        GROUP BY
            labels.id
        ORDER BY
            labels.id;
    `;
    const labelsArray = await db.all(getLabelsQuery);
    response.send(labelsArray);
});
app.get('/notes/', authenticateToken, async (request, response) => {
    const { username } = request;
    const { label } = request.query;

    console.log(username);

    let getNotesQuery = `
        SELECT notes.* 
        FROM notes 
        INNER JOIN users ON notes.userId = users.id 
        WHERE users.username = ?
    `;

    if (label) {
        getNotesQuery += `
            AND notes.id IN (
                SELECT noteId 
                FROM notelabels 
                INNER JOIN labels ON notelabels.labelId = labels.id 
                WHERE labels.name = ?
            )
        `;
    }

    getNotesQuery += `
        GROUP BY notes.id 
        ORDER BY notes.id
    `;

    try {
        const notesArray = label
            ? await db.all(getNotesQuery, [username, label])
            : await db.all(getNotesQuery, [username]);

        response.send(notesArray);
    } catch (error) {
        console.error('Error fetching notes:', error);
        response.status(500).send('An error occurred while fetching notes.');
    }
});

app.get('/notes/Archieved', authenticateToken, async (request, response) => {
    const { username } = request;
    console.log(username);
    const getNotesQuery = `SELECT notes.* FROM notes INNER JOIN users ON notes.userId= users.id 
    WHERE   users.username='${username}' AND notes.isArchived='1'
    GROUP BY 
    notes.id
    ORDER BY
    notes.id`;
    const notesArray = await db.all(getNotesQuery);
    response.send(notesArray);
});

app.post('/notes/', authenticateToken, async (request, response) => {
    const { title, description, backgroundColor } = request.body;
    const { username } = request;

    const userQuery = `SELECT id FROM users WHERE username = '${username}'`;
    const user = await db.get(userQuery);

    if (user) {
        const userId = user.id;
        const createNoteQuery = `
            INSERT INTO 
                notes (title, description, backgroundColor, userId, isArchived, isTrashed,createdAt,updatedAt) 
            VALUES 
                ('${title}', '${description}', '${backgroundColor}', ${userId},0 ,0, CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;

        await db.run(createNoteQuery);
        response.status(201).send('Note created successfully');
    } else {
        response.status(400).send('User not found');
    }
});

app.put('/notes/:id', authenticateToken, async (request, response) => {
    const { id } = request.params;
    const { title, description, backgroundColor, isArchived, isTrashed } =
        request.body;
    const { username } = request;

    // Retrieve the user ID based on the username
    const userQuery = `SELECT id FROM users WHERE username = '${username}'`;
    const user = await db.get(userQuery);

    if (user) {
        const userId = user.id;

        // Ensure the note belongs to the user
        const noteQuery = `SELECT userId FROM notes WHERE id = ${id}`;
        const note = await db.get(noteQuery);

        if (note && note.userId === userId) {
            const updateNoteQuery = `
                UPDATE notes
                SET 
                    title = '${title}',
                    description = '${description}',
                    backgroundColor = '${backgroundColor}',
                    isArchived = ${isArchived},
                    isTrashed = ${isTrashed},
                    updatedAt = CURRENT_TIMESTAMP
                WHERE 
                    id = ${id}`;

            await db.run(updateNoteQuery);
            response.send('Note updated successfully');
        } else {
            response
                .status(403)
                .send('You do not have permission to update this note');
        }
    } else {
        response.status(400).send('User not found');
    }
});
// Create a label
app.post('/labels', authenticateToken, async (req, res) => {
    const { label } = req.body;
    const { username } = req;

    try {
        // Check if the user exists
        const userQuery = `SELECT id FROM users WHERE username = ?`;
        const user = await db.get(userQuery, [username]);

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check if the label already exists
        const checkLabelQuery = `SELECT id FROM labels WHERE name = ?`;
        const existingLabel = await db.get(checkLabelQuery, [label]);

        if (existingLabel) {
            // Label exists, return the existing label ID
            return res.status(200).json({ id: existingLabel.id });
        }

        // Create a new label if it does not exist
        const createLabelQuery = `INSERT INTO labels (name) VALUES (?)`;
        await db.run(createLabelQuery, [label]);
        const labelId = await db.get('SELECT last_insert_rowid() AS id');

        res.status(201).json({ id: labelId.id });
        console.log('Label created successfully');
    } catch (error) {
        console.error('Error handling label:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/labelnotes', authenticateToken, async (req, res) => {
    const { labelId, noteId } = req.body;

    try {
        console.log(
            `Attempting to link labelId ${labelId} with noteId ${noteId}`
        );

        const checkLabelQuery = `SELECT * FROM labels WHERE id = ?`;
        const checkNoteQuery = `SELECT * FROM notes WHERE id = ?`;

        const label = await db.get(checkLabelQuery, [labelId]);
        const note = await db.get(checkNoteQuery, [noteId]);

        if (label && note) {
            const insertLabelNoteQuery = `INSERT INTO notelabels (labelId, noteId) VALUES (?, ?)`;
            await db.run(insertLabelNoteQuery, [labelId, noteId]);
            res.status(201).send('Label linked to note successfully');
            console.log(
                `Successfully linked labelId ${labelId} with noteId ${noteId}`
            );
        } else {
            res.status(400).send('Invalid label or note');
            console.log(
                `Invalid label or note for labelId ${labelId} and noteId ${noteId}`
            );
        }
    } catch (error) {
        console.error('Error linking label to note:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/notes/Archieved/', authenticateToken, async (request, response) => {
    const { username } = request;

    console.log(username);

    let getNotesQuery = `
        SELECT notes.* 
        FROM notes 
        INNER JOIN users ON notes.userId = users.id 
        WHERE users.username = ? AND isArchieved!=0
        GROUP BY notes.id 
        ORDER BY notes.id
    `;

    try {
        const notesArray = await db.all(getNotesQuery, [username]);

        response.send(notesArray);
    } catch (error) {
        console.error('Error fetching notes:', error);
        response.status(500).send('An error occurred while fetching notes.');
    }
});
app.get('/notes/Trashed/', authenticateToken, async (request, response) => {
    const { username } = request;

    console.log(username);

    let getNotesQuery = `
        SELECT notes.* 
        FROM notes 
        INNER JOIN users ON notes.userId = users.id 
        WHERE users.username = ? AND isTrashed!=0
        GROUP BY notes.id 
        ORDER BY notes.id
    `;

    try {
        const notesArray = await db.all(getNotesQuery, [username]);

        response.send(notesArray);
    } catch (error) {
        console.error('Error fetching notes:', error);
        response.status(500).send('An error occurred while fetching notes.');
    }
});
app.put('/notes/trash/:id', authenticateToken, async (request, response) => {
    const { id } = request.params;
    const { isTrashed } = request.body;
    const { username } = request;

    // Retrieve the user ID based on the username
    const userQuery = `SELECT id FROM users WHERE username = '${username}'`;
    const user = await db.get(userQuery);

    if (user) {
        const userId = user.id;

        // Ensure the note belongs to the user
        const noteQuery = `SELECT userId FROM notes WHERE id = ${id}`;
        const note = await db.get(noteQuery);

        if (note && note.userId === userId) {
            const updateNoteQuery = `
                UPDATE notes
                SET 
                    
                    isTrashed = ${isTrashed},
                    updatedAt = CURRENT_TIMESTAMP
                WHERE 
                    id = ${id}`;

            await db.run(updateNoteQuery);
            response.send('Note updated successfully');
        } else {
            response
                .status(403)
                .send('You do not have permission to update this note');
        }
    } else {
        response.status(400).send('User not found');
    }
});
app.delete('/notes/:id', authenticateToken, async (request, response) => {
    const { id } = request.params;
    const { username } = request;

    // Retrieve the user ID based on the username
    const userQuery = `SELECT id FROM users WHERE username = '${username}'`;
    const user = await db.get(userQuery);

    if (user) {
        const userId = user.id;

        // Ensure the note belongs to the user
        const noteQuery = `SELECT userId FROM notes WHERE id = ${id}`;
        const note = await db.get(noteQuery);

        if (note && note.userId === userId) {
            const updateNoteQuery = `
                DELETE FROM notes
                WHERE 
                    id = ${id}`;

            await db.run(updateNoteQuery);
            response.send('Note deleted successfully');
        } else {
            response
                .status(403)
                .send('You do not have permission to update this note');
        }
    } else {
        response.status(400).send('User not found');
    }
});
app.delete('/labels/:id', authenticateToken, async (request, response) => {
    const { id } = request.params;

    const { username } = request;

    // Retrieve the user ID based on the username
    const userQuery = `SELECT id FROM users WHERE username = '${username}'`;
    const user = await db.get(userQuery);

    if (user) {
        const userId = user.id;

        // Ensure the note belongs to the user
        const noteQuery = `SELECT userId FROM notes WHERE id = ${id}`;
        const note = await db.get(noteQuery);

        const updateNoteQuery = `
                DELETE FROM labels
                WHERE 
                    id = ${id}`;

        await db.run(updateNoteQuery);
        response.send('Note deleted successfully');
    } else {
        response.status(400).send('User not found');
    }
});
