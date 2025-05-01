import fs from 'fs-extra';
import express from 'express'; // Ensure express is imported
// import { nanoid } from 'nanoid';
import path from 'path';
// 
// app.use(express.static('public'));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'joia.html'));
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// 
import fs from 'fs-extra';
import express from 'express';
import path from 'path';
import cors from 'cors'; // Import the cors module

export default class Server { // Renamed for generality
    constructor() {
        this.app = express(); // Initialize Express app
        this.app.use(express.json()); // Middleware to parse JSON bodies
        this.app.use(cors()); // Enable CORS middleware

        this.usersPath = path.join(process.cwd(), 'data/users.json'); // Path to users data
        this.itemsPath = path.join(process.cwd(), 'data/items.json'); // Path to items data
        
        this.setupRoutes();
    }

    async getUsers() {
        const usersData = await fs.readJson(this.usersPath);
        return usersData;
    }

    async getItems() {
        const itemsData = await fs.readJson(this.itemsPath);
        return itemsData;
    }

    setupRoutes() {
        this.app.post('/login', async (req, res) => {
            try {
                const { username, password } = req.body;
                const users = await this.getUsers();
                const userExists = [...users.customers, ...users.sellers, ...users.admins].some(user => user.username === username && user.password === password);

                if (userExists) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            } catch (error) {
                console.error('Login error:', error);
                res.sendStatus(500);
            }
        });

        // New route for searching items
        this.app.get('/search-items', async (req, res) => {
            try {
                const { query } = req.query; // Assume the search query is passed as a URL parameter
                const items = await this.getItems();
                
                const filteredItems = items.filter(item => 
                    item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.description?.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.toLowerCase().includes(query.toLowerCase())
                );

                res.json(filteredItems);
            } catch (error) {
                console.error('Search items error:', error);
                res.sendStatus(500);
            }
        });

        this.app.post('/api/purchase', async (req, res) => {
            console.log("Reached");
            try {
                const { username, totalPrice } = req.body;
                const success = await this.updateUserBalance(username, totalPrice);
                if (success) {
                    res.sendStatus(200);
                } else {
                    res.status(404).send('User not found');
                }
            } catch (error) {
                console.error('Error updating user balance:', error);
                res.sendStatus(500);
            }
        });
        
    }

    

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

// To start the server, you would create a new instance of the Server class and call the start method
const server = new Server();
server.start(3000);
