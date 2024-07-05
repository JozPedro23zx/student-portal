import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateStudentUsecase } from '@core/student/application/create-student/create-student.usecase';
import CreateStudentInput from '@core/student/application/create-student/input-create-student';
import UpdateStudentInput from '@core/student/application/update-student/input-update-student';
import { FindStudentUsecase } from '@core/student/application/find-student/find-student.usecase';
import { FindAllStudentUsecase } from '@core/student/application/find-student/find-all-students.usecase';
import { UpdateStudentUsecase } from '@core/student/application/update-student/update-student.usecase';
import { DeleteStudentUsecase } from '@core/student/application/delete-student/delete-student';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

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

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() input: CreateStudentInput) {
    return await this.createUsecase.execute(input);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Body() ids?: string[]) {
    return await this.findAllUsecase.execute({ ids });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.findUsecase.execute({id: id});
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentInput) {
    return await this.updateUsecase.execute(updateStudentDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUsecase.execute({id});
  }
}
