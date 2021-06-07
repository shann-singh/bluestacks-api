# Bluestacks API

A simple Express API to fetch, store and play most popular YouTube videos.
The API is currently hosted using Heroku at https://secure-forest-43886.herokuapp.com/.

## Instruction to Run the API

### Instruction 1

#### Method 1: Locally

##### Clone the repository, install node packages

```
git clone https://github.com/shann-singh/bluestacks-api
cd bluestacks-api
npm install
npm start
```

#### Method 2: Using Docker

```
git clone https://github.com/shann-singh/bluestacks-api
cd bluestacks-api
docker-compose build
docker-compose up
```

### Instruction 2

##### Connect with an instance of MySQL from Workbench using the username, password and mysql port details provided as environment variables. Afterwards, create a database of the same name specified in env variables and then create a table 'video' of schema specified in schema.sql file.

## API Endpoints

### 1) Fetch most popular videos from Youtube and save them into DB

```
POST /videos/fetch-popular

body : {
          "maxResults": {10 to 50}
       }
```

### 2) Get videos from DB (max 20 at a time)

```
GET /videos/fetch-popular?page={page_number}
```

### 3) Fetch a video's and its channel info from YouTube

```
GET /videos/video-details?videoID={videoID}
```

## Sample .env file to setup before running API

```
PORT = port_number
GOOGLE_API_KEY=your_google_api_key

# MYSQL
MS_CONNECTION_LIMIT=10
MS_HOST=localhost
MS_PORT=3306
MS_USER=root
MS_PWD=your_mysql_password
MS_DB=your_db_name

# REDIS
REDIS_URL=redis://localhost:6379
```
