import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { CustomerController } from './controllers/customers.controller';
import { UsersService } from './services/users.service';
import { CustomersService } from './services/customers.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [UsersController, CustomerController],
  providers: [UsersService, CustomersService],
})
export class UsersModule {}
