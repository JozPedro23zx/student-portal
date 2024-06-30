import { StudentModel } from '@core/student/infrastructure/sequelize/student.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from '../config/config.module';
import { SubjectModel, TeacherModel } from '@core/teacher/infrastructure/sequelize/teacher.model';
import { ClassRoomModel } from '@core/classroom/infrastructure/sequelize/classroom.model';

const models = [StudentModel, TeacherModel, SubjectModel, ClassRoomModel];

@Module({
    imports: [
        SequelizeModule.forRootAsync({
          useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
            const dbVendor = configService.get('DB_VENDOR');
            if (dbVendor === 'sqlite') {
              return {
                dialect: 'sqlite',
                host: configService.get('DB_HOST'),
                models,
                logging: configService.get('DB_LOGGING'),
                autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
              };
            }
    
            if (dbVendor === 'postgres') {
              return {
                dialect: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                database: configService.get('DB_DATABASE'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                models,
                logging: configService.get('DB_LOGGING'),
              };
            }
    
            throw new Error(`Unsupported database configuration: ${dbVendor}`);
          },
          inject: [ConfigService],
        }),
      ],
})
export class DatabaseModule {}