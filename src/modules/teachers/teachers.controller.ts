import { CreateTeacherUsecase } from '@core/teacher/application/create-teacher/create-teacher.usecase';
import CreateTeacherInput from '@core/teacher/application/create-teacher/input-create-teacher';
import { DeleteTeacherUsecase } from '@core/teacher/application/delete-teacher/delete-teacher.usecase';
import { FindAllTeacherUsecase } from '@core/teacher/application/find-teacher/find-all-teacher.usecase';
import { FindTeacherUsecase } from '@core/teacher/application/find-teacher/find-teacher.usecase';
import UpdateTeacherInput from '@core/teacher/application/update-teacher/input-update-teacher';
import { UpdateTeacherUsecase } from '@core/teacher/application/update-teacher/update-teacher.usecase';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';

@Controller('teachers')
export class TeachersController {
  @Inject(CreateTeacherUsecase)
  private createUsecase: CreateTeacherUsecase;

  @Inject(FindTeacherUsecase)
  private findUsecase: FindTeacherUsecase;

  @Inject(FindAllTeacherUsecase)
  private findAllUsecase: FindAllTeacherUsecase;

  @Inject(UpdateTeacherUsecase)
  private updateUsecase: UpdateTeacherUsecase;

  @Inject(DeleteTeacherUsecase)
  private deleteUsecase: DeleteTeacherUsecase;

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherInput) {
    return await this.createUsecase.execute(createTeacherDto)
  }

  @Get()
  async findAll(@Body() ids?: string[]) {
    return await this.findAllUsecase.execute({ ids })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.findUsecase.execute({ id })
  }

  @Patch()
  async update(@Body() updateTeacherDto: UpdateTeacherInput) {
    return await this.updateUsecase.execute(updateTeacherDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUsecase.execute({ id });
  }
}
