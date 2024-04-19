type JSONRecord = Record<string, any>;

interface ApiResponse {
    headers: Record<string, string>;
    statusCode: number;
    body: string;
}

class Responses {
    private static createResponse(statusCode: number, data: JSONRecord): ApiResponse {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: statusCode,
            body: JSON.stringify(data),
        };
    }

    public static OK(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(200, data);
    }

    public static Created(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(201, data);
    }

    public static NoContent(): ApiResponse {
        return this.createResponse(204, {});
    }

    public static BadRequest(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(400, data);
    }

    public static Unauthorized(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(401, data);
    }

    public static Forbidden(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(403, data);
    }

    public static NotFound(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(404, data);
    }

    public static Conflict(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(409, data);
    }

    public static InternalServerError(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(500, data);
    }

    public static NotImplemented(data: JSONRecord = {}): ApiResponse {
        return this.createResponse(501, data);
    }

    // Additional statuses can be added as needed
}

export default Responses;
