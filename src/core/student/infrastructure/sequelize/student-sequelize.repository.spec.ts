import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { StudentSequelizeRepository } from "./student-sequelize.repository";
import { StudentModel } from "./student.model";
import { StudentFakeBuilder } from "@core/student/domain/student.fake";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

describe("Student sequelize repository integration tests", ()=>{
    let repository: StudentSequelizeRepository;

    setupSequelize({ models: [StudentModel] });

    beforeEach(async ()=>{
        repository = new StudentSequelizeRepository(StudentModel);
    })


    it('should create a new entity', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);
        const studentCreated = await repository.find(student.entityId);
        expect(studentCreated!.toJSON()).toStrictEqual(student.toJSON());
      });
    
      it('should finds a entity by id', async () => {
        let entityFound = await repository.find(new Uuid());
        expect(entityFound).toBeNull();
    
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);
        entityFound = await repository.find(student.entityId);
        expect(student.toJSON()).toStrictEqual(entityFound!.toJSON());
      });
    
      it('should return all categories', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);
        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([student]));
      });
    
      it('should throw error on update when a entity not found', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await expect(repository.update(student)).rejects.toThrow("Not found error");
      });
    
      it('should update a entity', async () => {
        const student = StudentFakeBuilder.aStudent().build();
        await repository.create(student);
    
        student.changeName('Movie updated');
        await repository.update(student);
    
        const entityFound = await repository.find(student.entityId);
        expect(student.toJSON()).toStrictEqual(entityFound!.toJSON());
      });
    
      it('should throw error on delete when a entity not found', async () => {
        const studentId = new Uuid();
        await expect(repository.delete(studentId)).rejects.toThrow("Not found error");
      });
    
      it('should delete a entity', async () => {
        const entity = StudentFakeBuilder.aStudent().build();
        await repository.create(entity);
    
        await repository.delete(entity.entityId);
        await expect(repository.find(entity.entityId)).resolves.toBeNull();
      });
})