# CodeClash - Problem Solving Dashboard API



## Project Overview

**CodeClash** is a comprehensive platform designed for competitive programmers / problem solvers to track and manage their problem-solving journey. It provides a centralized dashboard for tracking coding problems, managing deadlines, and measuring progress over time. Additionally, it offers a social environment where coders can connect, share experiences, and challenge each other.

## Features

### User Authentication System
- Traditional email/password registration and login
- OAuth integration with Google and GitHub for streamlined sign-up
- JWT-based authentication for secure API access
- Password encryption using bcrypt for enhanced security

### Problem Management
- Add coding problems from various platforms via URL links
- Automatic metadata extraction from problem links
- Status tracking (pending, started, completed)
- Deadline setting and management
- Comprehensive problem listing and detailed views

### Social Features
- Friend request system with send, accept, and reject functionality
- Friend list management
- Pending friend request tracking
- Unfriend capability

### Blog and Discussion System
- Create, read, update, and delete blog posts
- Comment functionality on blog posts
- Nested comments (replies) with one level of depth

### Statistics and Reporting
- Generate statistical reports on problem-solving patterns
- PDF report generation and download capability
- Visual representation of performance metrics
- Problem completion trends and efficiency analysis

## Technology Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Sequelize ORM**: Object-Relational Mapping for database interaction
- **JWT (JSON Web Tokens)**: Secure authentication
- **Passport.js**: Authentication middleware with Google and GitHub OAuth
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management

### Database
- **PostgreSQL**: Robust relational database system
- **Relationships**: Models for users, problems, blogs, comments, and friends

### Development & Utilities
- **express-session**: Session management
- **pdfkit**: PDF generation for reports

## Installation

1. Clone the repository:
```bash
 git clone https://github.com/SadLabib/CodeClash.git
```

2. Navigate to the project directory:
```bash
 cd CodeClash
```

3. Install dependencies:
```bash
 npm install
```

4. Set up environment variables in a `.env` file:
```
 DATABASE_URL=your_database_url
 JWT_SECRET=your_jwt_secret
 GOOGLE_CLIENT_ID=your_google_client_id
 GOOGLE_CLIENT_SECRET=your_google_client_secret
 GITHUB_CLIENT_ID=your_github_client_id
 GITHUB_CLIENT_SECRET=your_github_client_secret
```

5. Run the application:
```bash
 npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Authenticate user and get JWT
- `GET /api/auth/google`: Google OAuth authentication
- `GET /api/auth/github`: GitHub OAuth authentication

### Problem Management
- `POST /api/problems/create`: Create a new problem
- `GET /api/problems/list`: Retrieve user's problems
- `PUT /api/problems/update/:id`: Update a problem
- `DELETE /api/problems/delete/:id`: Delete a problem

### Social Features
- `POST /api/friends/add`: Send a friend request
- `POST /api/friends/accept`: Accept a friend request
- `POST /api/friends/reject`: Reject a friend request
- `GET /api/friends/list`: Get user's friends
- `POST /api/friends/unfriend`: Unfriend a user

### Blog and Comment System
- `POST /api/blogs/create`: Create a new blog post
- `GET /api/blogs/list`: Get all blogs
- `POST /api/comments/create`: Add a comment

### Reports & Statistics
- `GET /api/reports/statistics`: Get problem-solving statistics
- `GET /api/reports/pdf`: Generate and download a PDF report

## Future Enhancements
- Coding Duels: Compete with friends in real-time challenges
- Integration with platforms like LeetCode, Codeforces, and HackerRank
- Enhanced analytics with machine learning
- Mobile application development
- Real-time notifications

## License
This project is licensed under the MIT License.

## Author
- **Ahmed Sadman Labib** - BSc in Software Engineering - Islamic University of Technology
