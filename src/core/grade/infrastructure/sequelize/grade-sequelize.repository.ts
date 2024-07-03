import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { StudentModel } from "@core/student/infrastructure/sequelize/student.model";
import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Grade } from "../../domain/grade.entity";
import { GradeModel } from "./grade.model";
import { IGradeRepository } from "../grade.repository";
import { GradeMapper } from "./grade-mapper.model";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";

@Injectable()
export class GradeSequelizeRepository implements IGradeRepository{
    constructor(private gradeModel: typeof GradeModel) {}

    async create(entity: Grade): Promise<void> {
        const model = GradeMapper.toModel(entity);
        await this.gradeModel.create(model.toJSON());
    }

    async update(entity: Grade): Promise<void> {
        const model = GradeMapper.toModel(entity);

        const [affectedRows] = await this.gradeModel.update(
            model.toJSON(),
            { where: { id: entity.entityId.id } }
        );

        if (affectedRows === 0) {
            throw new CustomNotFoundError(entity.entityId.id, Grade.name)
        }
    }

    async delete(uuid: Uuid): Promise<void> {
        const affectedRows = await this.gradeModel.destroy({ where: { id: uuid.id } });

        if (affectedRows === 0) {
            throw new CustomNotFoundError(uuid.id, Grade.name)
        }
    }

    async find(uuid: Uuid): Promise<Grade | null> {
        const model = await this.gradeModel.findByPk(uuid.id);

        return model ? GradeMapper.toEntity(model) : null;
    }

    async findByIds(uuids: Uuid[]): Promise<Grade[]> {
        const models = await this.gradeModel.findAll({
            where: {
                id: {
                    [Op.in]: uuids.map((id) => id.id),
                },
            }
        });

        return models.map((model) => GradeMapper.toEntity(model));
    }

    async findAll(): Promise<Grade[]> {
        const models = await this.gradeModel.findAll();

        return models.map((model) => GradeMapper.toEntity(model));
    }
}