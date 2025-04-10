DROP DATABASE IF EXISTS events_platform_database;
CREATE DATABASE events_platform_database;

\c events_platform_database;

-- CREATE TYPE user_role AS ENUM ('volunteer', 'organization');

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_title VARCHAR(40) UNIQUE NOT NULL,
    event_description TEXT NOT NULL,
    event_date TIMESTAMP NOT NULL,
    event_location VARCHAR(100) NOT NULL,
    event_organizer VARCHAR(40) NOT NULL,
    event_organizer_email VARCHAR(40) NOT NULL,
    event_organizer_phone VARCHAR(20) NOT NULL,
    event_organizer_website VARCHAR(100) NOT NULL,
    event_image_url TEXT DEFAULT NULL
);

INSERT INTO events (event_title, event_description, event_date, event_location, event_organizer, event_organizer_email, event_organizer_phone, event_organizer_website, event_image_url) 
VALUES
('Community Cleanup', 'Join us for a community cleanup event to make our neighborhood beautiful!', '2023-11-15 10:00:00', 'Central Park, NY', 'Green Earth Org', 'contact@greenearth.org', '123-456-7890', 'https://greenearth.org', 'https://example.com/cleanup.jpg'),
('Food Drive', 'Help us collect and distribute food to those in need.', '2023-12-01 09:00:00', 'Downtown Community Center, NY', 'Helping Hands', 'info@helpinghands.org', '987-654-3210', 'https://helpinghands.org', 'https://example.com/fooddrive.jpg'),
('Blood Donation Camp', 'Donate blood and save lives. Every drop counts!', '2023-11-20 08:00:00', 'City Hospital, NY', 'Red Cross', 'support@redcross.org', '555-123-4567', 'https://redcross.org', 'https://example.com/blooddonation.jpg'),
('Tree Plantation Drive', 'Join us in planting trees to make our city greener.', '2023-11-25 07:30:00', 'Green Valley Park, NY', 'Eco Warriors', 'team@ecowarriors.org', '444-555-6666', 'https://ecowarriors.org', 'https://example.com/treeplantation.jpg'),
('Charity Run', 'Participate in our charity run to support underprivileged children.', '2023-12-10 06:00:00', 'Riverside Park, NY', 'Run for Hope', 'events@runforhope.org', '333-222-1111', 'https://runforhope.org', 'https://example.com/charityrun.jpg');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('staff', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password_hash, email, role) 
VALUES 
('admin_user', 'hashed_password_1', 'admin@example.com', 'staff'),
('john_doe', 'hashed_password_2', 'john.doe@example.com', 'user'),
('jane_smith', 'hashed_password_3', 'jane.smith@example.com', 'user'),
('event_manager', 'hashed_password_4', 'manager@example.com', 'staff'),
('alice_wonder', 'hashed_password_5', 'alice.wonder@example.com', 'user');