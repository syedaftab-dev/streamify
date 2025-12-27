## STREAM - used for make chatting/video application 
    1. open stream and go to app(left) - create a new project under development and on top right we have API keys(important)

## Important Routes and Diagrams - link : https://app.eraser.io/workspace/kiTRUaytr8fJjmfPj3PQ

### generate a jwn token secret string randomly using zsh terminal
    command: openssl rand -base64 32

## Authentication

### Signup Flow Guide
Your signup logic follows a standard secure authentication flow:

1. **Input Extraction**: You extract email, password, and fullName from the request body.
2. **Validation**:
    - **Completeness**: Checks if all required fields are present.
    - **Security**: Enforces a minimum password length (6 characters).
    - **Format**: Validates the email format using a Regular Expression.
3. **Uniqueness Check**: Queries the database to ensure the email is not already registered.
4. **Profile Generation**: Generates a random avatar URL using an external service (avatar.iran.liara.run).
5. **User Creation**: Creates a new User document.
    - *Note*: The password hashing is handled automatically by the pre('save') hook in your User.js model, so you don't need to hash it manually in the controller.
6. **Token Generation**: Creates a JSON Web Token (JWT) signed with the user's ID, valid for 7 days.
7. **Session Management**: Sets the JWT in an HTTP-only cookie. This is crucial for security as it prevents client-side JavaScript from accessing the token (mitigating XSS attacks).
8. **Response**: Returns the created user data (excluding sensitive info like the password) to the frontend.

### Login Flow Guide
Your login logic ensures secure user authentication:

1. **Input Extraction**: You extract email and password from the request body.
2. **Validation**: Checks if both email and password are provided.
3. **User Lookup**: Queries the database to find the user by email.
4. **Credential Verification**:
    - **Existence**: Checks if the user exists.
    - **Password Match**: Verifies the provided password against the stored hashed password using the `matchPassword` method.
5. **Token Generation**: Creates a JSON Web Token (JWT) signed with the user's ID, valid for 7 days.
6. **Session Management**: Sets the JWT in an HTTP-only cookie with security flags (httpOnly, sameSite, secure).
7. **Response**: Returns the user data upon successful authentication.

### Protect Route Middleware Guide
This middleware secures your routes by verifying the user's session:

1. **Token Extraction**: Retrieves the JWT from the `jwt` cookie in the request.
2. **Existence Check**: Verifies if a token is present. If not, access is denied (401 Unauthorized).
3. **Token Verification**: Decodes and verifies the token's signature using your `JWT_SECRET_KEY`.
4. **User Retrieval**: Uses the `userId` from the decoded token to find the user in the database, explicitly excluding the password field for security.
5. **User Validation**: Checks if the user associated with the token still exists.
6. **Context Attachment**: Attaches the full user object to the `req` object (`req.user`) so downstream controllers can access the authenticated user's details.
7. **Proceed**: Calls `next()` to pass control to the next middleware or route handler.

