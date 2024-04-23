/* eslint-disable import/no-import-module-exports */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */
/* eslint-disable prettier/prettier */
import * as yup from "yup";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hooksWithValidation } from "../shared/services/hookService";

const GoodbyeSchema = yup.object().shape({
    name: yup.string().required(),
});

type GoodbyeType = yup.InferType<typeof GoodbyeSchema>;

const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody: GoodbyeType = JSON.parse(event.body || '');
    console.log(`parsedBody: ${parsedBody}`);
    
    return {
      statusCode: 200,
      body: `Goodbye ${parsedBody?.name}`,
    };
  } catch (err) {
    console.error(JSON.stringify(err));
    return {
      statusCode: 500,
      body: 'An error occured',
    };
  }
};

exports.handler = hooksWithValidation({ bodySchema: GoodbyeSchema })(handler);