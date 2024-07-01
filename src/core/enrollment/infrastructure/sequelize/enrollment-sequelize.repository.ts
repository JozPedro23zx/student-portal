import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { Student } from "@core/student/domain/student.entity";
import { Op } from "sequelize";
import { IEnrollmentRepository } from "../enrollment-interface.repository";
import { EnrollmentMapperModel } from "./enrollment-mapper.model";
import { EnrollmentModel } from "./enrollment.model";

export class EnrollmentSequelizeRepository implements IEnrollmentRepository {
    constructor(private enrollmentModel: typeof EnrollmentModel) {}
  
    async create(entity: Enrollment): Promise<void> {
      const model = EnrollmentMapperModel.toModel(entity);
      await this.enrollmentModel.create(model.toJSON());
    }
  
    async update(entity: Enrollment): Promise<void> {
      const model = EnrollmentMapperModel.toModel(entity);
  
      const [affectedRows] = await this.enrollmentModel.update(model.toJSON(), {
        where: { id: entity.entityId.id },
      });
  
      if (affectedRows === 0) {
        throw new CustomNotFoundError(entity.entityId.id, Student.name)
      } 
    }
  
    async delete(uuid: Uuid): Promise<void> {
      const affectedRows = await this.enrollmentModel.destroy({ where: { id: uuid.id } });
  
      if (affectedRows === 0) {
        throw new CustomNotFoundError(uuid.id, Enrollment.name);
      }
    }
  
    async find(uuid: Uuid): Promise<Enrollment> {
      const model = await this.enrollmentModel.findByPk(uuid.id);
      return model ? EnrollmentMapperModel.toEntity(model) : null;
    }
  
    async findByIds(uuids: Uuid[]): Promise<Enrollment[]> {
      const models = await this.enrollmentModel.findAll({
        where: {
          id: {
            [Op.in]: uuids.map((id) => id.id),
          },
        },
      });
      return models.map((model) => EnrollmentMapperModel.toEntity(model));
    }
  
    async findAll(): Promise<Enrollment[]> {
      const models = await this.enrollmentModel.findAll();
      return models.map((model) => EnrollmentMapperModel.toEntity(model));
    }
  }