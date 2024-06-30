
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Op } from "sequelize";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { IClassRoomRepository } from "../classroom-interface.repository";
import { ClassRoomModel } from "./classroom.model";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { ClassRoomMapperModel } from "./classroom-mapper.model";

export class ClassRoomSequelizeRepository implements IClassRoomRepository {
    constructor(private classRoomModel: typeof ClassRoomModel) {}

    async create(entity: ClassRoom): Promise<void> {
        const model = ClassRoomMapperModel.toModel(entity);
        await this.classRoomModel.create(model.toJSON());
    }

    async update(entity: ClassRoom): Promise<void> {
        const model = ClassRoomMapperModel.toModel(entity);

        const [affectedRows] = await this.classRoomModel.update(
            model.toJSON(),
            {
                where: { id: entity.entityId.id }
            }
        );

        if (affectedRows === 0) {
            throw new CustomNotFoundError(entity.entityId.id, ClassRoom.name);
        }
    }

    async delete(uuid: Uuid): Promise<void> {
        const affectedRows = await this.classRoomModel.destroy({ where: { id: uuid.id } });

        if (affectedRows === 0) {
            throw new CustomNotFoundError(uuid.id, ClassRoom.name)
        }
    }

    async find(uuid: Uuid): Promise<ClassRoom | null> {
        const model = await this.classRoomModel.findByPk(uuid.id);

        return model ? ClassRoomMapperModel.toEntity(model) : null;
    }

    async findByIds(uuids: Uuid[]): Promise<ClassRoom[]> {
        const models = await this.classRoomModel.findAll({
            where: {
                id: {
                    [Op.in]: uuids.map((id) => id.id)
                }
            }
        });
        return models.map((model) => ClassRoomMapperModel.toEntity(model));
    }

    async findAll(): Promise<ClassRoom[]> {
        const models = await this.classRoomModel.findAll();
        return models.map((model) => ClassRoomMapperModel.toEntity(model));
    }
}
