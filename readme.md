## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/Ad-Hash-User-Management.git
    cd Ad-Hash-User-Management
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/20) file in the root directory and add the following environment variables:
    ```
    PORT=3000
    MONGODB_CONNECTION_STRING=your-mongodb-connection-string
    ENCRYPTION_ALGORITHM=aes-256-ecb
    ENCRYPTION_SECRET_KEY=your-secret-key
    ```

## Usage

1. Start the server:

    ```sh
    npm start
    ```

2. For development, you can use:

    ```sh
    npm run dev
    ```

3. The server will be running on `http://localhost:5006`.

## API Endpoints

### User Management

- **Register User**

    - `POST /api/user/register`
    - Request Body:
        ```json
        {
        	"name": "John Doe",
        	"email": "john.doe@example.com",
        	"mobileNumber": 1234567890,
        	"password": "password123",
        	"country": "Country",
        	"city": "City",
        	"state": "State",
        	"gender": "Male"
        }
        ```

- **Login User**
    - `POST /api/user/login`
    - Request Body:
        ```json
        {
        	"email": "john.doe@example.com",
        	"password": "password123"
        }
        ```

### Task Management

- **Get All Tasks**

    - `GET /api/tasks/`

- **Create Task**

    - `POST /api/tasks/`
    - Request Body:
        ```json
        {
        	"taskName": "Task 1",
        	"description": "Task description",
        	"status": "Pending",
        	"startDate": "2025-02-18T00:00:00.000Z",
        	"endDate": "2025-02-19T00:00:00.000Z",
        	"totalTask": 5
        }
        ```

- **Get Task by ID**

    - `GET /api/tasks/:id`

- **Update Task**

    - `PUT /api/tasks/:id`
    - Request Body:
        ```json
        {
        	"taskName": "Updated Task",
        	"description": "Updated description",
        	"status": "In Progress",
        	"startDate": "2025-02-18T00:00:00.000Z",
        	"endDate": "2025-02-19T00:00:00.000Z",
        	"totalTask": 5
        }
        ```

- **Delete Task**

    - `DELETE /api/tasks/:id`

- **Filter Tasks by Status**

    - `GET /api/tasks/filter/:status`

- **Paginate Tasks**
    - `GET /api/tasks/pagination/:page/:limit`

### Hello World

- **Hello World**
    - `GET /api/helloworld`

## Middleware

- **Rate Limiter**: Limits the number of requests to prevent abuse.
- **Error Handler**: Handles errors and sends appropriate responses.
- **Not Found**: Handles 404 errors for undefined routes.
- **Request Logger**: Logs details of every request.
- **Authourize User** Once loggedin then validate the token every request

## Logging

Logging is implemented using [winston](http://_vscodecontentref_/21) and [winston-daily-rotate-file](http://_vscodecontentref_/22). Logs are stored in the [logs](http://_vscodecontentref_/23) directory.

## License

This project is licensed under the ISC License.
