import { StudentUsecase } from "../create-student/create-sudent.usecase";
import { StudentModel } from "@core/student/infrastructure/sequelize/student.model";
import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { StudentSequelizeRepository } from "@core/student/infrastructure/sequelize/student-sequelize.repository";

describe("Student use-case integration tests", ()=>{
    let repository: StudentSequelizeRepository;
    let usecase: StudentUsecase;

    setupSequelize({ models: [StudentModel] });

    beforeEach(()=>{
        repository = new StudentSequelizeRepository(StudentModel);
        usecase = new StudentUsecase(repository);
    })

    it("should create a student", async ()=>{
        const input = {
            "first_name": "Jon",
            "last_name": "Silver",
            "date_of_birth": new Date("1999-05-14"), 
            "street": "Flower Street",
            "number": 123,
            "city": "Old York",
            "phone_number": "12345-6789"
        };

        let output = await usecase.execute(input);

        let entity = await repository.find(new Uuid(output.id));

        expect(output.id).toBe(entity.entityId.id);
        expect(output.first_name).toBe(entity.first_name);
        expect(output.last_name).toBe(entity.last_name);
        expect(output.date_of_birth.toISOString()).toBe(entity.date_of_birth.toISOString());
        expect(output.street).toBe(entity.address.street);
        expect(output.number).toBe(entity.address.number);
        expect(output.city).toBe(entity.address.city);
        expect(output.phone_number).toBe(entity.phone_number);
    
        // Para as datas, ignorar os milissegundos
        expect(Math.floor(new Date(output.createdAt).getTime() / 1000)).toBe(Math.floor(new Date(entity.createdAt).getTime() / 1000));
        expect(Math.floor(new Date(output.updatedAt).getTime() / 1000)).toBe(Math.floor(new Date(entity.updatedAt).getTime() / 1000));


    })

})