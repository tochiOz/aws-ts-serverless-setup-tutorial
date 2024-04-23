import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsCommand,
    DeleteObjectCommand,
    PutObjectCommandInput,
    GetObjectCommandInput,
    ListObjectsCommandInput,
    DeleteObjectCommandInput
} from "@aws-sdk/client-s3";
import { Readable } from 'stream';

interface S3ServiceInterface {
    uploadFile(bucketName: string, key: string, body: Buffer | Uint8Array | Blob | string | Readable): Promise<void>;
    getFile(bucketName: string, key: string): Promise<Readable>;
    listFiles(bucketName: string): Promise<string[]>;
    deleteFile(bucketName: string, key: string): Promise<void>;
}

class S3Service implements S3ServiceInterface {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({ region: "us-east-1" });
    }

    async uploadFile(bucketName: string, key: string, body: Buffer | Uint8Array | Blob | string | Readable): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: key,
            Body: body
        };
        const command = new PutObjectCommand(params);
        await this.client.send(command);
    }

    async getFile(bucketName: string, key: string): Promise<Readable> {
        const params: GetObjectCommandInput = {
            Bucket: bucketName,
            Key: key
        };
        const command = new GetObjectCommand(params);
        const response = await this.client.send(command);
        if (response.Body instanceof Readable) {
            return response.Body;
        } else {
            throw new Error("Expected file download to be a stream.");
        }
    }

    async listFiles(bucketName: string): Promise<string[]> {
        const params: ListObjectsCommandInput = {
            Bucket: bucketName
        };
        const command = new ListObjectsCommand(params);
        const response = await this.client.send(command);
        return response.Contents?.map(item => item.Key as string) || [];
    }

    async deleteFile(bucketName: string, key: string): Promise<void> {
        const params: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: key
        };
        const command = new DeleteObjectCommand(params);
        await this.client.send(command);
    }
}

export { S3Service };
