import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { RespositoryTypes } from "../Types/repository";

interface Item {
    id: string;
    data?: any;
}

interface DynamoDBServiceInterface {
    createItem(item: Item, tableName: string): Promise<void>;
    getItem(id: string, tableName: string): Promise<Item>;
    getAllItems(tableName: string): Promise<Item[]>;
    deleteItem(id: string, tableName: string): Promise<void>;
}

let options: RespositoryTypes.DynamoOptions = {};

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
} else if (process.env.JEST_WORKER_id) {
    options = {
        region: 'local-env',
        endpoint: 'http://localhost:8000',
        sslEnabled: false,
    }
}

class DynamoDBService implements DynamoDBServiceInterface {
    private client: DynamoDBDocumentClient;

    constructor() {
        const dbClient = new DynamoDBClient(options);
        this.client = DynamoDBDocumentClient.from(dbClient);
    }

    async createItem(item: Item, tableName: string): Promise<void> {
        const command = new PutCommand({
            TableName: tableName,
            Item: item
        });
        await this.client.send(command);
    }

    async getItem(id: string, tableName: string): Promise<Item> {
        const command = new GetCommand({
            TableName: tableName,
            Key: { id }
        });
        const response = await this.client.send(command);
        return response.Item as Item;
    }

    async getAllItems(tableName: string): Promise<Item[]> {
        const command = new ScanCommand({
            TableName: tableName
        });
        const response = await this.client.send(command);
        return response.Items as Item[];
    }

    async deleteItem(id: string, tableName: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: tableName,
            Key: { id }
        });
        await this.client.send(command);
    }
}

export { DynamoDBService, Item, DynamoDBServiceInterface };
