## Tasty Hive

Tasty Hive is a menu management system where admins can add, edit, and manage a menu that is publicly viewable but only editable by authorized administrators. Users can sign up, log in, and edit their profiles, while admins have additional privileges such as promoting users to admin roles.

## Features

## Admin Features:

->Admin login system

->Add/Edit/Delete menu items

->Manage menu categories with unlimited depth 

->View the list of users

->Promote users to admin

## User Features:

->User signup & login

->Edit personal profile details

->View menu items (publicly available)

->Authentication & Authorization:

->Email ID as the primary key for login

->Authentication managed using JWT tokens

->Role-based access control (User/Admin)

## Getting Started

## Prerequisites

Ensure you have the following installed on your system:

->Node.js (Latest LTS version recommended)

->Git

->MongoDB (for local development)

->Visual Studio Code (VS Code)
<br><br>

## Installation & Setup

1. Clone the Repository
    https://github.com/Ananthu-kp/TastyHive.git
    cd TastyHive

2. Open in VS Code
    code .

3. Setup Backend
    cd Backend
    npm install

Environment Variables

Create a .env file inside the backend directory and configure the following:

    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

## Run the backend server:
    npm run dev

<br>
4. Setup Frontend
    cd Frontend
    npm install

Run the frontend application:
    npm run dev

## Accessing the Application

Frontend URL: http://localhost:5173

Backend API: http://localhost:3000

Admin Credentials (For Testing)

After setting up, you can manually promote a user to admin using MongoDB or via API request.