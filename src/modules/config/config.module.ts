import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('postgres', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

type CONFIG_JWT_SCHEMA_TYPE = {
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;
};

export const CONFIG_JWT_SCHEMA: Joi.StrictSchemaMap<CONFIG_JWT_SCHEMA_TYPE> = {
  JWT_PUBLIC_KEY: Joi.string().required(),
  JWT_PRIVATE_KEY: Joi.string().optional(),
};

@Module({})
export class MyConfigModule extends ConfigModule {
  static forRoot() {


    const envFilePath = process.env.NODE_ENV
      ? join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`)
      : join(process.cwd(), 'envs', '.env');

    return super.forRoot({
      isGlobal: true,
      envFilePath: [envFilePath],
      validationSchema: Joi.object({ ...CONFIG_DB_SCHEMA, ...CONFIG_JWT_SCHEMA })
    })
  }
}
