import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Student } from "@core/student/domain/student.entity";
import { IStudentRepository } from "../student-interface.repository";
import { StudentMapperModel } from "./student-mapper.model";
import { StudentModel } from "./student.model";
import { Op } from "sequelize";

export class StudentSequelizeRepository implements IStudentRepository{
    constructor(private studentModule: typeof StudentModel) {}

    async create(entity: Student): Promise<void> {
        const model = StudentMapperModel.toModel(entity);
        await this.studentModule.create(model.toJSON());
    }
    
    async update(entity: Student): Promise<void> {
        const model =  StudentMapperModel.toModel(entity);

        const [affectedRows] = await this.studentModule.update(
            model.toJSON(),
            {
                where:{id: entity.entityId.id}
            }
        );

        if(affectedRows === 0){
            throw new Error("Not found error");
        }else if(affectedRows > 1){
            throw new Error("More than line was affected");
        }
    }

    async delete(uuid: Uuid): Promise<void> {
        const affectedRows = await this.studentModule.destroy({where: {id: uuid.id}});

        if(affectedRows === 0){
            throw new Error("Not found error");
        }else if(affectedRows > 1){
            throw new Error("More than line was affected");
        }
    }

    async find(uuid: Uuid): Promise<Student> {
        const model = await this.studentModule.findByPk(uuid.id);

        return model ? StudentMapperModel.toEntity(model) : null;
    }

    async findByIds(uuids: Uuid[]): Promise<Student[]> {
        const models = await this.studentModule.findAll(
            {
                where: {
                    id: {
                        [Op.in]: uuids.map((id)=> id.id)
                    }
                }
            }
        );
        return models.map((model)=> StudentMapperModel.toEntity(model));
    }

    async findAll(): Promise<Student[]> {
        const models = await this.studentModule.findAll();
        return models.map((model) => StudentMapperModel.toEntity(model));
    }
    
}