# Secure Note X

Secure Note X is a modern note-taking application with a focus on security and ease of use. This project uses a client-server architecture with a Node.js, Express and Prisma backend for database management, and a React frontend with TypeScript and TailwindCSS

## Features

### Authentication System
- **Account Creation**: Registration with first name, last name, username, and password
- **Secure Authentication**: Login with username and password
- **Session Management**: Persistent sessions with HTTP-only cookies
- **Automatic Expiration**: Configurable timeout for session expiration
- **Logout**: Secure session removal on both server and client sides

### Note Management
- **Dashboard**: Overview of all notes with title, description, and dates
- **Note Creation**: Intuitive interface for creating new notes
- **Note Editing**: Ability to modify title and description of existing notes
- **Rich Text Editor**: Interface based on PrimeReact Editor for writing notes
- **Note Deletion**: Ability to delete existing notes

### Editing Features
- **Rich Formatting**: Text formatting (bold, italic, underline, etc.)
- **Automatic Saving**: Periodic content saving to prevent data loss
- **Status Indicators**: Real-time saving status (Modified, Saving, Saved)
- **Real-time Updates**: Change tracking and synchronization with the server

### User Interface
- **Responsive Design**: Adapted to different screen sizes
- **Intuitive Navigation**: Simple structure with dashboard and editor
- **Notifications**: Feedback system to inform the user of actions
- **Modern Theme**: Elegant user interface with red accents
- **Error Handling**: Explicit error messages and redirection in case of problems

### Security
- **Password Hashing**: Using Argon2 for secure hashing
- **CSRF Protection**: Secure cookies with SameSite strict
- **HTTP-only Cookies**: Protection against XSS attacks
- **Helmet Middleware**: Protection against various web vulnerabilities
- **Input Validation**: Server-side and client-side verification

## Usage Guide

### Registration and Login
1. Access the home page
2. Click on "I'm new here" to create an account
3. Fill out the form with your personal information
4. After registration, log in with your credentials

### Note Management
1. After logging in, you'll access the dashboard
2. Create a new note by clicking the "+" button in the bottom right
3. Fill in the title and description of the note
4. Click on an existing note to access its content
5. Modify or delete a note using the available options

### Note Editing
1. In the note editor, use the toolbar to format your text
2. The content is automatically saved every 2 seconds
3. The status indicator at the top of the screen shows the saving status
4. Click "Exit" to return to the dashboard

## License
This project is for educational purposes only.

---

**Developed by Ilyas_B (https://www.linkedin.com/in/ilyas-bouktrane/)**
*This project is created for educational purposes only and is not an official product.*
