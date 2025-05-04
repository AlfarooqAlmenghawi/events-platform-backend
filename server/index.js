const express = require("express");
const router = express.Router();

const authenticationRoutes = require("./routes/authenticationRoutes.js");
const eventsRoutes = require("./routes/eventsRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");

/* API Overview route: returns all available endpoints and usage examples. This route is not protected by authentication, and is meant to provide a quick reference for developers using the API. */

router.get("/", (request, response) => {
  response.json([
    {
      method: "POST",
      path: "/register",
      description: "Register a new user.",
      body: {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "Password123!",
      },
    },
    {
      method: "GET",
      path: "/verify/:token",
      description: "Verify user's email using a token.",
    },
    {
      method: "POST",
      path: "/login",
      description: "Log in a user and get a JWT token.",
      body: {
        email: "john@example.com",
        password: "Password123!",
      },
    },
    {
      method: "GET",
      path: "/profile",
      description: "Get the authenticated user's profile.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "GET",
      path: "/my-events",
      description: "Get events the authenticated user has signed up for.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "GET",
      path: "/my-created-events",
      description: "Get events created by the authenticated user.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "POST",
      path: "/upload",
      description: "Upload an image file to Supabase.",
      headers: {
        Authorization: "Bearer <token>",
      },
      "form-data": {
        image: "file",
      },
    },
    {
      method: "GET",
      path: "/events",
      description:
        "Retrieve a list of events with optional query parameters (search, sort_by, order).",
    },
    {
      method: "GET",
      path: "/events/:id",
      description: "Retrieve details of a specific event.",
    },
    {
      method: "POST",
      path: "/events",
      description: "Create a new event.",
      headers: {
        Authorization: "Bearer <token>",
      },
      body: {
        event_title: "Community Picnic",
        event_description: "A fun day for the whole family.",
        event_date: "2025-06-01T12:00:00Z",
        event_location: "Central Park",
        event_organizer_phone: "123-456-7890",
        event_organizer_website: "https://example.com",
        event_date_end: "2025-06-01T18:00:00Z",
        event_image_url: "https://example.com/image.jpg",
      },
    },
    {
      method: "PUT",
      path: "/events/:id",
      description: "Update an event (organizer only).",
      headers: {
        Authorization: "Bearer <token>",
      },
      body: {
        event_title: "Updated Picnic",
        event_description: "Updated description.",
        event_date: "2025-06-01T14:00:00Z",
        event_location: "Updated Park",
        event_organizer_phone: "123-456-0000",
        event_organizer_website: "https://updated.com",
        event_image_url: "https://example.com/updated-image.jpg",
      },
    },
    {
      method: "DELETE",
      path: "/events/:id",
      description: "Delete an event (organizer only).",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "GET",
      path: "/events/:id/attendees",
      description: "Get list of attendees for an event.",
    },
    {
      method: "DELETE",
      path: "/events/:id/attendees/:attendee_id",
      description: "Remove an attendee from an event (organizer only).",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "POST",
      path: "/events/:id/signup",
      description: "Sign up for an event.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "DELETE",
      path: "/events/:id/signup",
      description: "Unsign from an event.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
    {
      method: "GET",
      path: "/users",
      description: "Get a list of all users.",
    },
    {
      method: "GET",
      path: "/users/:id",
      description: "Get a specific user's information.",
    },
    {
      method: "GET",
      path: "/users/:id/events",
      description: "Get all events a user has signed up for.",
      headers: {
        Authorization: "Bearer <token>",
      },
    },
  ]);
});

router.use("/", authenticationRoutes);
router.use("/events", eventsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
