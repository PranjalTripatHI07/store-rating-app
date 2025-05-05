# Store Rating Application

A web application that allows users to submit ratings for stores registered on the platform. The application features a single login system with role-based access control for administrators, normal users, and store owners.

## Tech Stack

- **Backend**: ExpressJS
- **Database**: MySQL
- **Frontend**: ReactJS with React Router and Context API
- **Authentication**: JWT (JSON Web Tokens)

## Features

### User Roles

1. **System Administrator**

   - Add new stores, normal users, and admin users
   - Access dashboard with statistics
   - Manage users and stores
   - Apply filters on listings

2. **Normal User**

   - Register and log in to the platform
   - Update password
   - View and search for stores
   - Submit and modify ratings (1-5 star system)

3. **Store Owner**
   - Log in to the platform
   - Update password
   - View users who have rated their store
   - See average store rating


# MySQL Database Schema for Store Rating Application

Here's the MySQL database schema for the store rating application.

```sql
-- Create the database (if not exists)
CREATE DATABASE IF NOT EXISTS store_rating_db;
USE store_rating_db;

-- Users table
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE Stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL,
  ownerId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ownerId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Ratings table
CREATE TABLE Ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  userId INT NOT NULL,
  storeId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (storeId) REFERENCES Stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (userId, storeId)
);
```

## Schema Details

### Users Table
- **id**: Auto-incrementing primary key
- **name**: User's full name (20-60 characters)
- **email**: Unique email address
- **password**: Hashed password (stored as 8-16 characters with at least one uppercase letter and one special character)
- **address**: User's address (max 400 characters)
- **role**: User role (admin, user, or store_owner)
- **createdAt/updatedAt**: Timestamp fields for record creation and updates

### Stores Table
- **id**: Auto-incrementing primary key
- **name**: Store name (20-60 characters)
- **email**: Unique store email
- **address**: Store address (max 400 characters)
- **ownerId**: Foreign key reference to Users table (must be a store_owner)
- **createdAt/updatedAt**: Timestamp fields for record creation and updates

### Ratings Table
- **id**: Auto-incrementing primary key
- **rating**: Integer value between 1-5
- **userId**: Foreign key reference to Users table (the user who submitted the rating)
- **storeId**: Foreign key reference to Stores table (the store being rated)
- **createdAt/updatedAt**: Timestamp fields for record creation and updates
- A unique constraint ensures one user can only have one rating per store

The schema follows the Sequelize ORM models defined in the application and includes proper relationships between tables with foreign key constraints.





## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v8 or higher)

### Database Setup

1. Create a MySQL database:

   ```sql
   CREATE DATABASE store_rating_db;
   ```

2. Create a `.env` file in the server directory with your MySQL credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_db
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   ```

### Installation

#### Step 1: Clone or Download the Project

If you're downloading directly, extract the zip file to your desired location.

#### Step 2: Install Dependencies

Open a terminal and navigate to the project root directory:

```bash
# Install dependencies for both server and client
npm install

# If you prefer to install them separately
npm run install:server
npm run install:client
```

#### Step 3: Set up the Database

Run the database migration to create the necessary tables:

```bash
npm run migrate
```

#### Step 4: (Optional) Seed Sample Data

This will create sample users, stores, and ratings:

```bash
npm run seed
```

After seeding, you'll have access to these sample accounts:

- **Admin**: admin@storerating.com / Admin@123
- **Store Owner**: owner1@example.com / Owner@123
- **Normal User**: user1@example.com / User@123

### Running the Application

#### Development Mode

Start both the server and client in development mode:

```bash
npm run dev
```

Or start them separately:

```bash
# Run server only
npm run server:dev

# Run client only
npm run client
```

#### Production Mode

```bash
# Build the client
cd client && npm run build

# Start the server only
npm run server
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage Guide

### Default Admin Account

After migration, you can log in with the default admin account:

- Email: admin@storerating.com
- Password: Admin@123

### User Registration and Login

1. Navigate to `/register` to create a new normal user account
2. Fill in the registration form with valid data
3. Once registered, you'll be logged in automatically
4. To log in again later, go to `/login`

### Managing Users (Admin)

1. Log in as an admin
2. Navigate to the Users section
3. View, add, edit, or delete users as needed
4. Apply filters to search for specific users

### Managing Stores (Admin)

1. Log in as an admin
2. Navigate to the Stores section
3. Add, edit, or delete stores as needed
4. Assign store owners when creating a store

### Rating Stores (Normal User)

1. Log in as a normal user
2. Browse the list of stores
3. Click on a store to view details
4. Submit or update your rating (1-5 stars)

### Viewing Store Ratings (Store Owner)

1. Log in as a store owner
2. View your dashboard with average ratings and user reviews
3. See which users have rated your stores

## Form Validation

The application enforces the following validation rules:

- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Standard email validation
- **Rating**: Value between 1 and 5

## Project Structure

```
store-rating/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # React context providers
│       ├── pages/           # Page components
│       └── utils/           # Utility functions
│
├── server/                  # Express backend
│   ├── controllers/         # Route controllers
│   ├── database/            # Database configuration
│   ├── middleware/          # Express middleware
│   ├── models/              # Sequelize models
│   └── routes/              # API routes
│
└── package.json             # Root package.json for scripts
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/update-password` - Update user password

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/dashboard` - Get admin dashboard data

### Stores

- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create a new store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/owner/dashboard` - Get store owner dashboard data (Store owner only)

### Ratings

- `POST /api/ratings` - Submit a new rating or update existing (Normal user only)
- `GET /api/ratings/store/:storeId` - Get user's rating for a specific store (Normal user only)
- `DELETE /api/ratings/:id` - Delete a rating (Normal user or Admin)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Verify your MySQL service is running
   - Check the credentials in your `.env` file
   - Ensure the database exists

2. **JWT Token Issues**

   - Make sure JWT_SECRET is set in your `.env` file
   - Check if the token is expired

3. **Frontend Not Connecting to Backend**
   - Verify the proxy setting in client/package.json
   - Ensure backend server is running on the expected port

## OutPut

![Store Rating app](https://github.com/PranjalTripatHI07/store-rating-app/blob/main/clipgif2.gif)

![Store Rating app](https://github.com/PranjalTripatHI07/store-rating-app/blob/main/clipgif4.gif)

![Store Rating app](https://github.com/PranjalTripatHI07/store-rating-app/blob/main/clipgif1.gif)

![Store Rating app](https://github.com/PranjalTripatHI07/store-rating-app/blob/main/clipgif5.gif)

![Store Rating app](https://github.com/PranjalTripatHI07/store-rating-app/blob/main/clipgif6.gif)










## License

This project is open source and available under the [Pranjal Tripathi](LICENSE).
