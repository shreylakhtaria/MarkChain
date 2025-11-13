import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utility/utility.module';
import { EmailModule } from './email/email.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // MongoDB Configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    
    // GraphQL Configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req, res, connection }) => {
        if (req) {
          return { req, res };
        }
        if (connection) {
          return { req: connection.context, res: connection.context.res };
        }
        return { req: {}, res: {} };
      },
    }),
    
    // Feature Modules
    AuthModule,
    UserModule,
    UtilityModule,
    EmailModule,
    BlockchainModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
