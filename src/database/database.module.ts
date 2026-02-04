import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoClient } from 'mongodb';

import config from 'src/config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

/*
  const taskCollection = database.collection('tasks');
  const tasks = await taskCollection.find({}).toArray(); */

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { user, password, port, host, dbName, connection } =
          configService.mongo;
        const uri = `${connection}://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;
        return {
          uri,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { user, password, port, host, dbName, connection } =
          configService.mongo;
        const uri = `${connection}://${user}:${password}@${host}:${port}/?authSource=admin`;
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(dbName);
        return database;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'MONGO'],
})
export class DatabaseModule {}
