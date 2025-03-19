# Mystery Message

Mystery Message is a web application that lets users receive real feedback from real people. It includes features like password reset, account verification, and message management, with message suggestions powered by Google AI.

## Features

- User authentication and authorization
- Password reset functionality
- Account verification
- Message management
- AI-powered message suggestions using Google AI

## Technologies Used

- Next.js
- TypeScript
- MongoDB
- NextAuth.js
- React Hook Form
- Zod
- Axios
- Tailwind CSS
- Google AI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/masoommd/mystrymessage.git
   cd mystrymessage
Install dependencies:
bash
npm install
Set up environment variables:
Create a .env.local file in the root directory.
Add the following (replace with your own values):
bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
Run the application:
bash
npm run dev
Open http://localhost:3000 in your browser.
Usage
Sign up or log in to your account.
Verify your account via email (if implemented).
Manage your messages and get AI-suggested feedback.
Reset your password if needed through the reset functionality.
Contributing
Feel free to fork the repo, submit issues, or send pull requests. Contributions are welcome!
License
This project is licensed under the MIT License.
