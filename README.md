# YouTube Clone App

This is a YouTube clone application frontend built using React and Firestore. The user interface allows users to upload, view, like, and comment on videos, similar to the functionality provided by YouTube.

## Features

- User authentication: Users can sign up, sign in, and sign out securely.
- Video uploading: Users can upload videos to share with others.
- Video viewing: Users can browse and watch videos uploaded by other users.
- Like and comment: Users can like and comment on videos to engage with the content and other users.
- Search functionality: Users can search for videos based on their titles.
- Responsive design: The application is optimized for various screen sizes and devices.

## Technologies Used

- React: Frontend framework for building user interfaces.
- Firestore: Cloud-based NoSQL database for storing user data, video metadata.
- Firebase Authentication: Used for user authentication and authorization.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine for running the React frontend.
- Firebase account and Firestore set up for storing user data.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/etorelan/ytb_clone.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ytb_clone
   ```

3. Install frontend dependencies:

   ```bash
   cd ytb_clone_frontend
   npm install
   ```

4. Set up Firebase Firestore:
   - Create a Firebase project and set up Firestore.
   - Copy the Firebase configuration details into a .env file with variable names specified in Config.js.
   - Ensure Firestore rules allow read and write access as required.


5. Start the frontend server:

   ```bash
   # In the frontend directory
   npm start
   ```

6. Access the application in your web browser:

   ```
   http://localhost:3000
   ```


## License

This project is licensed under the MIT License

## Acknowledgments

- This project was inspired by the functionality provided by YouTube.
- Special thanks to the developers of React and Firestore for their amazing tools and documentation.
- Thanks to the open-source community for providing helpful resources and tutorials.