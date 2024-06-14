import { StudentRepositoryInMemory } from "@core/student/infrastructure/in-memory/student-in-memory.repository"
import { StudentUsecase } from "../create-student/create-sudent.usecase";
import { ValidationError } from "class-validator";

describe("Student unity tests", ()=>{
    let repository: StudentRepositoryInMemory;
    let usecase: StudentUsecase;

    beforeEach(()=>{
        repository = new StudentRepositoryInMemory();
        usecase = new StudentUsecase(repository);
    })

    describe("Create student usecase", ()=>{
        it("should throw error when validate entity", async ()=>{
            
            const input = {
                "first_name": "Jon",
                "last_name": "Silver",
                "date_of_birth": new Date("2015-05-14"), // Invalid date will emit error
                "street": "Flower Street",
                "number": 123,
                "city": "Old York",
                "phone_number": "12345-6789"
            };

            await expect(usecase.execute(input)).rejects.toThrow();
        })

        it("should create a student", async ()=>{
            const spyCreate = jest.spyOn(repository, 'create');

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

            expect(spyCreate).toHaveBeenCalledTimes(1);
            expect(output).toStrictEqual({
                id: repository.entities[0].entityId.id,
                first_name: "Jon",
                last_name: "Silver",
                date_of_birth: new Date("1999-05-14"), 
                street: "Flower Street",
                number: 123,
                city: "Old York",
                phone_number: "12345-6789",
                createdAt: repository.entities[0].createdAt,
                updatedAt: repository.entities[0].updatedAt
            })
        })
    })
})