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

### Onboarding Flow Guide
This controller handles the completion of the user profile after initial signup:

1. **User Identification**: Retrieves the `userId` from the authenticated request (`req.user._id`), ensuring the user is logged in.
2. **Input Extraction**: Extracts profile details (fullName, bio, nativeLanguage, learningLanguage, location) from the request body.
3. **Validation**: Checks if all required fields are provided. If any are missing, it returns a 400 error specifying which fields are missing.
4. **Database Update**: Updates the user document in MongoDB:
    - Applies the new profile information.
    - Sets the `isOnBoarding` flag to `true`, marking the process as complete.
    - Returns the updated document (`new: true`).
5. **Stream Integration**: Synchronizes the updated user profile (name and image) with the Stream Chat service.
6. **Response**: Returns the fully updated user object to the frontend.


## Tanstack Query Guide
### 1. use the command - npm i @tanstack/react-query to install the react query package


        const [data, setData] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);

        useEffect(()=>{
            const getData = async () => {
            setIsLoading(true);
            try {
                const data = await fetch("https://jsonplaceholder.typicode.com/todos");
                const json = await data.json();
                setData(json);
            } catch (error) {
                setError(error);
            }finally {
                setIsLoading(false);
            }
            }
            
            getData();
        },[]);

        console.log(data);

The above is to fetch the data from api but if it fails it doesnt do it again,where tanstack query refetch is 3-4 times

### 2. Instead of above code we can use tanstack query

            const {data,isLoading,error}=useQuery({
                queryKey:["todos"],
                queryFn: async ()=>{
                const res=await axiosInstance.get("/auth/me");
                return res.data;
                },
                retry: false, // fetch only once
            })

            console.log(data);

## Query Flow
        1. React app loads
        2. useQuery runs automatically
        3. GET /auth/me is called
        4. JWT token sent in headers
        5. protectRoute verifies token
        6. Backend attaches req.user
        7. Backend returns user data
        8. React Query stores data in cache

# Frontend Pages
## 1. signup page

### This div creates a clean, responsive card container: it uses flex with flex-col to stack content vertically on mobile and switches to lg:flex-row to place sections side-by-side on large screens, w-full with max-w-5xl and mx-auto keeps it centered and readable on all screen sizes, bg-base-100, border border-primary/25, rounded-xl, and shadow-lg give it a modern card look, and overflow-hidden ensures child content doesn’t break the rounded corners—this is a production-ready layout pattern commonly used for auth pages and split sections.

    className='border border-primary/25 flex flex-col lg:fex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'

## Zustand Guide

### 1. Installation
    npm install zustand

### 2. Create Store
    import { create } from 'zustand';

    export const useStore = create((set) => ({
        count: 0,
        inc: () => set((state) => ({ count: state.count + 1 })),
    }));

### 3. Usage
    const { count, inc } = useStore();
