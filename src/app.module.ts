import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule  } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';



@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: "en",
        loaderOptions: {
          path: join("src/i18n/"),
          watch: true,
        },
      }),
      resolvers: [
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: Boolean(process.env.SYNCHRONIZE),
      autoLoadEntities: Boolean(process.env.AUTO_LOAD_ENTITIES),
      migrationsTableName: 'custom_migration_table',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    UsersModule,
    AuthModule
  ],
  //
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
