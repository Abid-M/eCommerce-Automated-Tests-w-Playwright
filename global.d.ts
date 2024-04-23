/*
This code declares a new module `NodeJS` and interface `ProcessEnv` in the global namespace. 
The `ProcessEnv` interface extends the `NodeJS.ProcessEnv` interface and defines the types for my environment variables.
*/
export {}
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EMAIL: string;
            PASSWORD: string;
        }
    }
}
