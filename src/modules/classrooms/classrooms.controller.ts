import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateClassRoomUseCase } from '@core/classroom/application/create-classroom/create-classroom';
import { FindClassRoomUsecase } from '@core/classroom/application/find-classroom/find-classroom';
import { UpdateClassRoomUseCase } from '@core/classroom/application/update-classroom/update-classroom';
import { FindAllClassRoomsUsecase } from '@core/classroom/application/find-classroom/find-all-classrooms';
import { DeleteClassRoomUsecase } from '@core/classroom/application/delete-classrom/delete-classroom';
import CreateClassRoomInput from '@core/classroom/application/create-classroom/input-create-classroom';
import UpdateClassRoomInput from '@core/classroom/application/update-classroom/input-update-classroom';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('classrooms')
export class ClassroomsController {
  @Inject(CreateClassRoomUseCase)
  private createUsecase: CreateClassRoomUseCase;

  @Inject(FindClassRoomUsecase)
  private findUsecase: FindClassRoomUsecase;

  @Inject(FindAllClassRoomsUsecase)
  private findAllUsecase: FindAllClassRoomsUsecase;

  @Inject(UpdateClassRoomUseCase)
  private updateUsecase: UpdateClassRoomUseCase;

  @Inject(DeleteClassRoomUsecase)
  private deleteUsecase: DeleteClassRoomUsecase;

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() createClassroomDto: CreateClassRoomInput) {
    return await this.createUsecase.execute(createClassroomDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Body() ids?: string[]) {
    return await this.findAllUsecase.execute({ids});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.findUsecase.execute({id});
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch()
  async update(@Body() updateClassroomDto: UpdateClassRoomInput) {
    return await this.updateUsecase.execute(updateClassroomDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUsecase.execute({id})
  }
}
