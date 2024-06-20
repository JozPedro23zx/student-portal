import { Module } from '@nestjs/common';
import { MyConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [MyConfigModule.forRoot(), DatabaseModule, StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
