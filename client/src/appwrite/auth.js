import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
import { setLoading } from "../store/loaderSlice";

export class AuthService {
    client;
    account;

    constructor() {
        this.client = new Client()
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                console.log(userAccount)
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    // async login({ email, password }) {
    //     try {
    //         return await this.account.createEmailSession(email, password);
    //     } catch (error) {
    //         console.error("Error logging in:", error);
    //         throw error;
    //     }
    // }

    async login({ email, password }) {
        try {
            setLoading(true);
            await this.account.createEmailPasswordSession(email, password);
            const session = await this.account.createJWT();
            console.log("User logged in, JWT:", session.jwt);

            if (session.jwt) {
                localStorage.setItem("authToken", session.jwt);
                this.client.setJWT(session.jwt)
            }

            return session;
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    

    // async getCurrentUser() {
    //     try {
    //         return await this.account.get();
    //     } catch (error) {
    //         console.error("Error fetching current user:", error);
    //         return null;
    //     }
    // }

    async getCurrentUser() {
        try {
            const jwt = localStorage.getItem("authToken");
            if (!jwt) return null;
    
            this.client.setJWT(jwt);

            const user = await this.account.get();
            console.log('User fetched successfully: ', user);
            return user;
        } catch (error) {
            console.error("Error fetching current user:", error.message);
            return null;
        }
    }
    

    async logout() {
        try {
            const jwt = localStorage.getItem("authToken");
            if (!jwt) throw new Error("No JWT found");

            this.client.setJWT(jwt);

            await this.account.deleteSessions();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
            return false
        }
    }
}

const authService = new AuthService();
export default authService;
