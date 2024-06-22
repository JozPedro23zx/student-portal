import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateStudentUsecase } from '@core/student/application/create-student/create-student.usecase';
import CreateStudentInput from '@core/student/application/create-student/input-create-student';
import UpdateStudentInput from '@core/student/application/update-student/input-update-student';
import { FindStudentUsecase } from '@core/student/application/find-student/find-student.usecase';
import { FindAllStudentUsecase } from '@core/student/application/find-student/find-all-students.usecase';
import { UpdateStudentUsecase } from '@core/student/application/update-student/update-student.usecase';
import { DeleteStudentUsecase } from '@core/student/application/delete-student/delete-student';

@Controller('students')
export class StudentsController {
  @Inject(CreateStudentUsecase)
  private createUsecase: CreateStudentUsecase;

  @Inject(FindStudentUsecase)
  private findUsecase: FindStudentUsecase;

  @Inject(FindAllStudentUsecase)
  private findAllUsecase: FindAllStudentUsecase;

  @Inject(UpdateStudentUsecase)
  private updateUsecase: UpdateStudentUsecase;

  @Inject(DeleteStudentUsecase)
  private deleteUsecase: DeleteStudentUsecase;

  @Post()
  async create(@Body() input: CreateStudentInput) {
    return await this.createUsecase.execute(input);
  }

  @Get()
  async findAll(@Body() ids?: string[]) {
    return await this.findAllUsecase.execute({ ids });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.findUsecase.execute({id: id});
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentInput) {
    return await this.updateUsecase.execute(updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUsecase.execute({id});
  }
}
