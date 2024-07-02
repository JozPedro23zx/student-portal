import { CreateEnrollmentUseCase } from '@core/enrollment/application/create-enrollment/create-enrollment.usecase';
import CreateEnrollmentInput from '@core/enrollment/application/create-enrollment/input-create-enrollment.usecas';
import { DeleteEnrollmentUseCase } from '@core/enrollment/application/delete-enrollment/delete-enrollment.usecase';
import { FindEnrollmentsByClassRoomUsecase } from '@core/enrollment/application/find/find-all-by-class.usecase';
import { FindAllEnrollmentsUseCase } from '@core/enrollment/application/find/find-all-enrollment.usecase';
import { FindEnrollmentByStudentUsecase } from '@core/enrollment/application/find/find-by-student.usecase';
import { FindEnrollmentUseCase } from '@core/enrollment/application/find/find-enrollment.usecase';
import { UpdateEnrollmentUsecase, UpdateEnrollmentInput } from '@core/enrollment/application/update-enrollment/update-enrollment.usecase';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';

@Controller('enrollments')
export class EnrollmentsController {
  @Inject(CreateEnrollmentUseCase)
  private createUsecase: CreateEnrollmentUseCase;

  @Inject(FindEnrollmentUseCase)
  private findUsecase: FindEnrollmentUseCase;

  @Inject(FindAllEnrollmentsUseCase)
  private findAllUsecase: FindAllEnrollmentsUseCase;

  @Inject(UpdateEnrollmentUsecase)
  private updateUsecase: UpdateEnrollmentUsecase;

  @Inject(DeleteEnrollmentUseCase)
  private deleteUsecase: DeleteEnrollmentUseCase;

  @Inject(FindEnrollmentByStudentUsecase)
  private findByStudentUsecase: FindEnrollmentByStudentUsecase;

  @Inject(FindEnrollmentsByClassRoomUsecase)
  private findByClassRoomUsecase: FindEnrollmentsByClassRoomUsecase;

  @Post()
  async create(@Body() input: CreateEnrollmentInput) {
    return await this.createUsecase.execute(input);
  }

  @Get()
  async findAll(@Body() ids?: string[]) {
    return await this.findAllUsecase.execute({ ids });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.findUsecase.execute({ id });
  }

  @Get('student/:student_id')
  async findByStudent(@Param('student_id') student_id: string) {
    return await this.findByStudentUsecase.execute({ student_id });
  }

  @Get('classroom/:class_id')
  async findByClassRoom(@Param('class_id') class_id: string) {
    return await this.findByClassRoomUsecase.execute({ class_id });
  }

  @Patch()
  async update(@Body() updateEnrollmentDto: UpdateEnrollmentInput) {
    return await this.updateUsecase.execute(updateEnrollmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUsecase.execute({ id });
  }
}
