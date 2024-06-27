import { TeacherModel, SubjectModel } from './teacher.model';
import { Teacher } from '../../domain/teacher.entity';
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import { Op } from 'sequelize';
import { TeacherMapperModel } from './teacher-mapper.model';
import { IRepository } from '@core/@shared/infrastructure/repository/repository-interface';
import { CustomNotFoundError } from '@core/@shared/erros/not-found.error';

export class TeacherSequelizeRepository implements IRepository<Teacher> {
    constructor(private teacherModel: typeof TeacherModel) {}

    async create(entity: Teacher): Promise<void> {
        const teacherModel = TeacherMapperModel.toModel(entity);
        console.log(teacherModel);
        await this.teacherModel.create(teacherModel.toJSON(), {
            include: [SubjectModel]
        });
    }

    async update(entity: Teacher): Promise<void> {
        const teacherModel = TeacherMapperModel.toModel(entity);

        const [affectedRows] = await this.teacherModel.update(
            teacherModel.toJSON(),
            {
                where: { id: entity.entityId.id }
            }
        );

        if (affectedRows === 0) {
            throw new CustomNotFoundError(entity.entityId.id, Teacher.name);
        }

        await SubjectModel.destroy({ where: { teacherId: entity.entityId.id } });
        const subjects = entity.subject_specialization.map(subject => ({
            id: new Uuid().id,
            type: subject.type,
            teacherId: entity.entityId.id
        }));
        await SubjectModel.bulkCreate(subjects, { ignoreDuplicates: true });
    }

    async delete(uuid: Uuid): Promise<void> {
        const affectedRows = await this.teacherModel.destroy({ where: { id: uuid.id } });

        if (affectedRows === 0) {
            throw new CustomNotFoundError(uuid.id, Teacher.name);
        }
    }

    async find(uuid: Uuid): Promise<Teacher> {
        const model = await this.teacherModel.findByPk(uuid.id, { include: [SubjectModel] });
        return model ? TeacherMapperModel.toEntity(model) : null;
    }

    async findByIds(uuids: Uuid[]): Promise<Teacher[]> {
        const models = await this.teacherModel.findAll({
            where: {
                id: {
                    [Op.in]: uuids.map((id) => id.id)
                }
            },
            include: [SubjectModel]
        });
        return models.map((model) => TeacherMapperModel.toEntity(model));
    }

    async findAll(): Promise<Teacher[]> {
        const models = await this.teacherModel.findAll({ include: [SubjectModel] });
        return models.map((model) => TeacherMapperModel.toEntity(model));
    }
}
