import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import config from './config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoClient } from 'mongodb';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';

const uri = `mongodb://root:root@localhost:27017/?authSource=admin`;
const client = new MongoClient(uri);
async function run() {

    await client.connect();
    const database = client.db('platzi-store');
    const taskCollection = database.collection('tasks');
    const tasks = await taskCollection.find({}).toArray();
    console.log(tasks);
}
run();


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        API_KEY: Joi.string().required(),
      }),
    }),
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const response = await firstValueFrom(
          http.get('https://jsonplaceholder.typicode.com/todos'),
        );
        return response.data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
