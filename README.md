# LakbÁI: AI-Driven Personalized Travel Itinerary Planner

LakbÁI is an AI-powered solution that generates personalized itineraries based on real-time data, user preferences, and budget management. The name "LakbÁI" is a wordplay on "lakbay", which means voyage in Tagalog (Filipino Dialect).

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.9+
- PostgreSQL 14+
- Git
- Node.js v18+
- npm 9.6+

The system runs with:
- Backend on port 8000
- Frontend on port 3000

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/anthnypaul/lakbai_project
cd lakbai_project
```

### 2. Set Up Virtual Environment
Create a virtual environment:
```bash
python3 -m venv lakbai_env
```

Activate the virtual environment:
```bash
# MacOS or Linux
source lakbai_env/bin/activate

# Windows
lakbai_env\Scripts\activate
```

### 3. Install Dependencies and Configure Environment
Install Python dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the root directory with the following content:
```
DATABASE_URL=postgresql://<username>:<password>@localhost/<database_name>
TESTING=False
OPENAI_API_KEY=<your_openai_key>
GOOGLE_PLACES_API_KEY=<your_google_places_key>
YELP_API_KEY=<your_yelp_key>
```

### 4. Set Up the Database

Connect to PostgreSQL:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE lakbai_db;
```

Create a user and grant privileges:
```sql
CREATE USER lakbai_user WITH PASSWORD 'password123';
ALTER ROLE lakbai_user SET client_encoding TO 'utf8';
ALTER ROLE lakbai_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lakbai_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE lakbai_db TO lakbai_user;
```

Connect to the database:
```sql
\c lakbai_db
```

Update your `.env` file with the database URL:
```
DATABASE_URL=postgresql://lakbai_user:password123@localhost/lakbai_db
```

### 5. Start the FastAPI Server
```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`

### 6. Set Up the Frontend
Navigate to the frontend directory and install dependencies:
```bash
cd lakbai_project/frontend
npm install
```

Create a `.env.local` file:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

Start the development server:
```bash
npm run dev
```

## Support
For issues or questions, please contact: pbagabaldo@outlook.com

## License
MIT License
