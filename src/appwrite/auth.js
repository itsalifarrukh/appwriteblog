import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) // Use conf.appwriteUrl
      .setProject(conf.appwriteProjectId); // Use conf.appwriteProjectId
    this.account = new Account(this.client);
  }

  // Method to create a new user account
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // Automatically log in the user after account creation
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Appwrite service :: createAccount :: error", error);
      throw error;
    }
  }

  // Method to log in a user
  async login({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  // Method to get the current logged-in user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: error", error);
      // Handle specific error codes if needed
      if (error.code === 401) {
        // User is not authenticated
        return null;
      }
      throw error;
    }
  }

  // Method to log out the current user
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
