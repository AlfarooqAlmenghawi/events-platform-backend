# Events Platform – Backend (Express.js on Railway)

This is the backend API for the Events Platform web app, built with **Express.js**, **PostgreSQL**, and **JWT authentication**. It powers all core functionality including event management, user authentication, image uploads, and Google Calendar integration support.

**Live API Base URL**:  
`https://events-platform-backend-production.up.railway.app/`

**Frontend Repo**:  
[Events Platform Frontend (React on Netlify)](https://github.com/AlfarooqAlmenghawi/events-platform)

## Features (MVP)

1. Register and verify users via email with verification code
2. JWT-protected login system with user profiles
3. Event creation, editing, and deletion for organizers
4. Event sign-up and un-sign for authenticated users
5. Organizer tools to view and manage attendees
6. Upload event banners to Supabase storage
7. Google Calendar integration support
8. Event browsing with filtering & sorting
9. Accessible API endpoint documentation

## Test Account

You can use this test account to authenticate and test JWT-protected endpoints:

```
Email: test@eventsplatform.com
Password: Eventsplatform8
```

## Here's How To Run This Backend Locally

1. Make sure you have `Node.js`, `npm`, and `PostgreSQL` set up on your computer.

2. Copy, paste and run the following commands in your terminal (it will download the repository into the current directory in your terminal):

```
git clone https://github.com/AlfarooqAlmenghawi/events-platform-backend.git
cd events-platform-backend
npm install
touch .env.production && echo '
DATABASE_URL=postgresql://postgres.hoqphugtdxjwawlawpzm:@P28vberf!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
EMAIL_USER=a.almenghawi123@gmail.com
EMAIL_PASS=cint etuj alyl pwlj
JWT_SECRET=e31ab42dcbe2f374af93511b2fbc7b0914e6e6c43268a1fc3c725eaf2e4b96dbacc2e081d40539e3f7396e7de2d0a90e8d9d45213f4e517c0f1b9180a11eb693
SUPABASE_URL=https://hoqphugtdxjwawlawpzm.supabase.co
SUPABASE_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcXBodWd0ZHhqd2F3bGF3cHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU2NTkzMSwiZXhwIjoyMDYwMTQxOTMxfQ.Wh6ViL0NxXeBdokdKbPuqJB-3dztf3nrtk_tc3djrnU
' > .env.production
npm run nodemon

```

⚠️ The `.env.production` shown above contains example values. In a real deployment, make sure to keep sensitive values secret.

⚠️ Some npm packages used by dependencies are deprecated or flagged by npm audit. This does not affect core functionality and the backend runs as expected.

Once run, the backend should be available at: http://localhost:3000

# API Endpoints

All responses are in JSON format. Authenticated routes require a `Bearer <your-JWT-token-here>` token in the `Authorization` header. Obtain a JWT token by sending a POST request to /login.

## Auth Routes (`/`)

| Method | Endpoint           | Description                   | Auth Required | Body / URL Params                            |
| ------ | ------------------ | ----------------------------- | ------------- | -------------------------------------------- |
| POST   | /register          | Register a new user           | No            | `{ first_name, last_name, email, password }` |
| GET    | /verify/:token     | Verify email using a token    | No            | `:token` in URL                              |
| POST   | /login             | Log in and receive JWT token  | No            | `{ email, password }`                        |
| GET    | /profile           | Get logged-in user's profile  | Yes           | —                                            |
| GET    | /my-events         | Get events user signed up for | Yes           | —                                            |
| GET    | /my-created-events | Get events user has created   | Yes           | —                                            |
| POST   | /upload            | Upload event image (Supabase) | Yes           | `multipart/form-data` key: `image`           |

## Events Routes (`/events`)

| Method | Endpoint                      | Description                       | Auth Required | Body / URL Params                                                                                                                                 |
| ------ | ----------------------------- | --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /events                       | Get all events (optional filters) | No            | `?search=`, `?sort_by=`, `?order=`                                                                                                                |
| GET    | /events/:id                   | Get specific event details        | Optional      | `:id` in URL                                                                                                                                      |
| POST   | /events                       | Create a new event                | Yes           | `{ event_title, event_description, event_date, event_location, event_organizer_phone, event_organizer_website, event_date_end, event_image_url }` |
| PUT    | /events/:id                   | Edit event (organizer only)       | Yes           | Same fields as above                                                                                                                              |
| DELETE | /events/:id                   | Delete event (organizer only)     | Yes           | `:id` in URL                                                                                                                                      |
| POST   | /events/:id/signup            | Sign up for an event              | Yes           | `:id` in URL                                                                                                                                      |
| DELETE | /events/:id/signup            | Unsign from an event              | Yes           | `:id` in URL                                                                                                                                      |
| GET    | /events/:id/attendees         | Get list of event attendees       | No            | `:id` in URL                                                                                                                                      |
| DELETE | /events/:id/attendees/:userId | Remove attendee (organizer only)  | Yes           | `:id`, `:userId` in URL                                                                                                                           |

## 👤 Users Routes (`/users`)

| Method | Endpoint          | Description                         | Auth Required | Body / URL Params |
| ------ | ----------------- | ----------------------------------- | ------------- | ----------------- |
| GET    | /users            | Get list of all users               | No            | —                 |
| GET    | /users/:id        | Get specific user by ID             | No            | `:id` in URL      |
| GET    | /users/:id/events | Get all events user is signed up to | Yes           | `:id` in URL      |

_You can also explore endpoints manually using tools like Insomnia._

## Tech Stack

**Node.js + Express.js** – Backend framework used for building the API routes to communicate with the database

**PostgreSQL** – The relational database holding all necessary and sensitive information

**JWT (JSON Web Token)** – A crucial part of the security model of this express server, ensures proper authentication and protects sensitive routes by requiring a JWT token that contains the user details. It also generates a JWT token when handling endpoints like /login and /signup, for the frontend to store this token in the cookie to identify the user everytime they revisit the website or take an action that requires having an account.

**bcrypt** – Used for Password hashing. bcrypt protects passwords by generating a random long hashed string that can only be verified using bcrypt's internal algorithm and stores them in the backend. It can tell if the password sent from the frontend matches the hashed password when comparing it during the /login endpoint.

**Supabase Storage** – For event image uploads.

**Nodemailer** – Used to send users an email verification code to their email to verify and activate their newly created account.

**Railway** – The platform used to host this express API. Railway provides a reasonably fast response time even during times where the API is idle.
