import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateGradeUsecase } from '@core/grade/application/create-grade/create-grade';
import { DeleteGradeUsecase } from '@core/grade/application/delete-grade/delete-grade.usecase';
import { FindGradeUsecase } from '@core/grade/application/find-grade/find-grade.usecase';
import { UpdateGradeUsecase } from '@core/grade/application/update-grade/update-grade.usecase';
import { FindAllGradesUsecase } from '@core/grade/application/find-grade/find-all-grade.usecase';
import CreateGradeInput from '@core/grade/application/create-grade/input-create-grade';
import UpdateGradeInput from '@core/grade/application/update-grade/input-update-grade.usecase';

@Controller('grades')
export class GradesController {
  @Inject(CreateGradeUsecase)
  private createUsecase: CreateGradeUsecase;

  @Inject(FindGradeUsecase)
  private findUsecase: FindGradeUsecase;

  @Inject(FindAllGradesUsecase)
  private findAllUsecase: FindAllGradesUsecase;

  @Inject(UpdateGradeUsecase)
  private updateUsecase: UpdateGradeUsecase;

  @Inject(DeleteGradeUsecase)
  private deleteUsecase: DeleteGradeUsecase;

  @Post()
  async create(@Body() input: CreateGradeInput) {
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
  async update(@Body() updateGradeDto: UpdateGradeInput) {
    return await this.updateUsecase.execute(updateGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUsecase.execute({id});
  }
}
