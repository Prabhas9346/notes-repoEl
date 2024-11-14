```markdown
# Quick Keep Notes

![Logo](frontend1/public/logo.png)

## Description
Quick Keep Notes is a single-page, full-stack note-taking application that allows users to quickly jot down their thoughts, ideas, and reminders. Built with a modern tech stack, this application offers a seamless user experience for managing notes efficiently.

## Features
- **User Authentication**: Sign up and log in securely using JWT authentication.
- **Create, Read, Update, and Delete (CRUD) Notes**: Users can create new notes, edit existing ones, and delete notes as needed.
- **Archiving and Trash System**: Notes can be archived or sent to trash, allowing for better organization and retrieval.
- **Labeling**: Users can create and assign labels to notes for easier categorization.
- **Responsive Design**: The application is mobile-friendly and works well on different devices.

## Technology Stack
- **Frontend**: 
  - React.js
  - React Router
  - CSS
  - Axios (for API calls)
  
- **Backend**:
  - Node.js
  - Express.js
  - SQLite (for database management)
  - JSON Web Tokens (JWT) for authentication
  - Bcrypt for password hashing

## Project Structure
```
notes-repoEl/
├── backend/
│   ├── server.js          # Main server file for the backend
│   └── keepNotes.db       # SQLite database file
└── frontend1/
    ├── public/
    │   └── index.html     # Main HTML file
    ├── src/
    │   ├── App.js         # Main React component
    │   ├── components/     # All React components
    │   └── utils/         # Utility functions
    └── index.js           # Entry point for the React application
```

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- SQLite

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Prabhas9346/notes-repoEl.git
   cd notes-repoEl
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:8000`.

4. Set up the frontend:
   ```bash
   cd ../frontend1
   npm install
   ```

5. Start the frontend application:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

## Usage Guide
1. Navigate to `http://localhost:3000` in your web browser.
2. Create an account by clicking on "Sign Up" and filling in the required details.
3. Log in to your account using your credentials.
4. Create, edit, archive, and delete notes as needed.
5. Use labels to organize your notes effectively.

## API Documentation
The application uses the following API endpoints:

### User Authentication
- **Sign Up**: `POST /SignUp/`
- **Sign In**: `POST /SignIn/`

### Notes
- **Create Note**: `POST /notes/`
- **Get Notes**: `GET /notes/`
- **Update Note**: `PUT /notes/:id`
- **Delete Note**: `DELETE /notes/:id`
- **Archive Note**: `PUT /notes/trash/:id`

### Labels
- **Create Label**: `POST /labels/`
- **Get Labels**: `GET /labels/`
- **Delete Label**: `DELETE /labels/:id`

## Contributing Guidelines
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License Information
This project does not have a specified license. Please check with the repository owner for licensing information.

## Contact/Support Information
For any questions or support, please contact the repository owner via GitHub.

---

Thank you for checking out Quick Keep Notes! Happy note-taking!
```
