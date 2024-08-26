import { Module, forwardRef } from "@nestjs/common";
import { TeachersModule } from "../teachers/teachers.module";
import { TeacherFacade } from "./services/teacher.facade";

@Module({
    imports: [forwardRef(() => TeachersModule)],
    providers: [TeacherFacade],
    exports: [TeacherFacade],
  })
  export class FacadeModule {}