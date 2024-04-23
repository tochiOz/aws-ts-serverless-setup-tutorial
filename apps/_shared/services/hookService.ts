// note install Yup when using this
import { useHooks, logEvent, parseEvent, handleUnexpectedError, State } from 'lambda-hooks';
import { ObjectSchema } from 'yup';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface ExtendedState extends State {
    event: APIGatewayProxyEvent;
    response?: APIGatewayProxyResult;
    config: HookConfig;
}

interface HookConfig {
    bodySchema?: ObjectSchema<any>;
    pathSchema?: ObjectSchema<any>;
}

const configureHooks = (config: HookConfig) => useHooks({
    before: [logEvent, parseEvent, async (state: ExtendedState) => await validateEvent(state, config)],
    after: [],
    onError: [handleUnexpectedError],
}, { config });

const validateEvent = async (state: ExtendedState, { bodySchema, pathSchema }: HookConfig): Promise<ExtendedState> => {
    if (bodySchema) {
        await validateSchema('body', state.event.body, bodySchema);
    }
    if (pathSchema) {
        await validateSchema('path parameters', state.event.pathParameters, pathSchema);
    }
    return state;
};

const validateSchema = async (name: string, data: any, schema: ObjectSchema<any>): Promise<void> => {
    try {
        await schema.validate(data, { strict: true });
    } catch (error) {
        throw new Error(`Validation error for ${name}: ${(error as unknown as any).message}`);
    }
};

export const withHooks = configureHooks({});
export const hooksWithValidation = (config: HookConfig) => configureHooks(config);
