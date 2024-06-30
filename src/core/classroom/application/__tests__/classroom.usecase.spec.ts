import { ClassRoomModel } from "@core/classroom/infrastructure/sequelize/classroom.model";
import { ClassRoomOutput } from "../output";
import { ClassRoomSequelizeRepository } from "@core/classroom/infrastructure/sequelize/classroom-sequelize.repository";
import { CreateClassRoomUseCase } from "../create-classroom/create-classroom";
import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { ClassRoomFakeBuilder } from "@core/classroom/domain/classroom.fake";
import { UpdateClassRoomUseCase } from "../update-classroom/update-classroom";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { FindClassRoomUsecase } from "../find-classroom/find-classroom";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { FindAllClassRoomsUsecase } from "../find-classroom/find-all-classrooms";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { DeleteClassRoomUsecase } from "../delete-classrom/delete-classroom";


describe("CreateClassRoomUseCase Integration Test", () => {
    let repository: ClassRoomSequelizeRepository;

    setupSequelize({ models: [ClassRoomModel] });

    beforeEach(() => {
        repository = new ClassRoomSequelizeRepository(ClassRoomModel);
    });

    describe("Create classroom usecase", ()=>{
        let createUseCase: CreateClassRoomUseCase;

        beforeEach(() => {
            repository = new ClassRoomSequelizeRepository(ClassRoomModel);
            createUseCase = new CreateClassRoomUseCase(repository);
        });

        it("should create a new classroom and return the output", async () => {
            const input = {
                grade_level: "5th Grade",
                start_date: new Date('2024-02-01'),
                end_date: new Date('2024-12-01')
            };
    
            const output: ClassRoomOutput = await createUseCase.execute(input);
    
            const model = await ClassRoomModel.findByPk(output.id);
    
            expect(model).toBeDefined();
            expect(model.grade_level).toBe(output.grade_level);
            expect(model.start_date.toISOString()).toBe(output.start_date.toISOString());
            expect(model.end_date.toISOString()).toBe(output.end_date.toISOString());
        });
    })

    describe("Update classroom usecase test", () => {
        let useCase: UpdateClassRoomUseCase;
    
        setupSequelize({ models: [ClassRoomModel] });
    
        beforeEach(() => {
            repository = new ClassRoomSequelizeRepository(ClassRoomModel);
            useCase = new UpdateClassRoomUseCase(repository);
        });
    
        it("should update a classroom and return the updated output", async () => {
            const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
            await repository.create(classRoom);
    
            const input = {
                id: classRoom.entityId.id,
                grade_level: "6th Grade",
                start_date: new Date('2024-02-01'),
                end_date: new Date('2024-11-01')
            };
    
            const output = await useCase.execute(input);
    
            const model = await ClassRoomModel.findByPk(output.id);
    
            expect(model).toBeDefined();
            expect(model.grade_level).toBe(output.grade_level);
            expect(model.start_date.toISOString()).toBe(output.start_date.toISOString());
            expect(model.end_date.toISOString()).toBe(output.end_date.toISOString());
        });
    
        it("should throw an error if the classroom does not exist", async () => {
            const input = {
                id: '469d546e-4bd4-4413-8a46-64b7f884b0b3',
                grade_level: "6th Grade",
                start_date: new Date('2024-02-01'),
                end_date: new Date('2024-11-01')
            };
    
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError)
        });
    });

    describe("Find classroom usecase test", () => {
        let findUseCase: FindClassRoomUsecase;
    
        setupSequelize({ models: [ClassRoomModel] });
    
        beforeEach(() => {
            repository = new ClassRoomSequelizeRepository(ClassRoomModel);
            findUseCase = new FindClassRoomUsecase(repository);
        });
    
        it("should find a classroom by id and return the output", async () => {
            const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
            await repository.create(classRoom);
    
            const input = { id: classRoom.entityId.id };
            const output = await findUseCase.execute(input);
    
            expect(output).toBeDefined();
            expect(output.id).toBe(classRoom.entityId.id);
            expect(output.grade_level).toBe(classRoom.grade_level);
            expect(output.start_date.toISOString()).toBe(classRoom.start_date.toISOString());
            expect(output.end_date.toISOString()).toBe(classRoom.end_date.toISOString());
            expect(output.createdAt.toISOString()).toBe(classRoom.createdAt.toISOString());
        });
    
        it("should throw an error if the classroom does not exist", async () => {
            const nonExistentId = new Uuid().id;
            const input = { id: nonExistentId };
    
            await expect(findUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });

    describe("FindAll classroom usecase test", () => {
        let findAllUseCase: FindAllClassRoomsUsecase;
    
        setupSequelize({ models: [ClassRoomModel] });
    
        beforeEach(() => {
            repository = new ClassRoomSequelizeRepository(ClassRoomModel);
            findAllUseCase = new FindAllClassRoomsUsecase(repository);
        });
    
        it("should find all classrooms by given ids", async () => {
            const classRooms = ClassRoomFakeBuilder.theClassRooms(3).build() as ClassRoom[];
    
            for (const classRoom of classRooms) {
                await repository.create(classRoom);
            }
    
            const classRoomIds = classRooms.map(classRoom => classRoom.entityId.id);
            const input = { ids: classRoomIds };
            let output = await findAllUseCase.execute(input);
    
            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(classRooms.length);
    
            output = classRoomIds.map(id => output.find(student => student.id === id));
            output.forEach((outputClassRoom, index) => {
                const classRoom = classRooms[index];
    
                expect(outputClassRoom.id).toBe(classRoom.entityId.id);
                expect(outputClassRoom.grade_level).toBe(classRoom.grade_level);
                expect(outputClassRoom.start_date.toISOString()).toBe(classRoom.start_date.toISOString());
                expect(outputClassRoom.end_date.toISOString()).toBe(classRoom.end_date.toISOString());
                expect(outputClassRoom.createdAt.toISOString()).toBe(classRoom.createdAt.toISOString());
            });
        });
    
        it("should throw an error if no classrooms found with given ids", async () => {
            const nonExistentIds = [new Uuid().id, new Uuid().id, new Uuid().id];
            const input = { ids: nonExistentIds };
    
            await expect(findAllUseCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    
        it("should find some classrooms by given ids", async () => {
            const classRooms = ClassRoomFakeBuilder.theClassRooms(3).build() as ClassRoom[];
    
            for (const classRoom of classRooms) {
                await repository.create(classRoom);
            }
    
            const partialIds = [classRooms[0].entityId.id, classRooms[2].entityId.id];
            const input = { ids: partialIds };
            const output = await findAllUseCase.execute(input);
    
            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(2);
    
            partialIds.forEach((id, index) => {
                const classRoom = classRooms.find(c => c.entityId.id === id);
                const outputClassRoom = output.find(c => c.id === id);
    
                expect(outputClassRoom.id).toBe(classRoom.entityId.id);
                expect(outputClassRoom.grade_level).toBe(classRoom.grade_level);
                expect(outputClassRoom.start_date.toISOString()).toBe(classRoom.start_date.toISOString());
                expect(outputClassRoom.end_date.toISOString()).toBe(classRoom.end_date.toISOString());
                expect(outputClassRoom.createdAt.toISOString()).toBe(classRoom.createdAt.toISOString());
            });
        });
    
        it("should find all classrooms when no ids are given", async () => {
            const classRooms = ClassRoomFakeBuilder.theClassRooms(3).build() as ClassRoom[];
    
            for (const classRoom of classRooms) {
                await repository.create(classRoom);
            }
    
            const output = await findAllUseCase.execute();
    
            expect(Array.isArray(output)).toBe(true);
            expect(output.length).toBe(classRooms.length);
    
            output.forEach((outputClassRoom, index) => {
                const classRoom = classRooms[index];
    
                expect(outputClassRoom.id).toBe(classRoom.entityId.id);
                expect(outputClassRoom.grade_level).toBe(classRoom.grade_level);
                expect(outputClassRoom.start_date.toISOString()).toBe(classRoom.start_date.toISOString());
                expect(outputClassRoom.end_date.toISOString()).toBe(classRoom.end_date.toISOString());
                expect(outputClassRoom.createdAt.toISOString()).toBe(classRoom.createdAt.toISOString());
            });
        });

    });
  
    describe("Delete classroom usecase test", () => {
        let useCase: DeleteClassRoomUsecase;
        let repository: ClassRoomSequelizeRepository;
    
        setupSequelize({ models: [ClassRoomModel] });
    
        beforeEach(() => {
            repository = new ClassRoomSequelizeRepository(ClassRoomModel);
            useCase = new DeleteClassRoomUsecase(repository);
        });
    
        it("should delete a classroom", async () => {
            const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
    
            await repository.create(classRoom);
    
            const input = { id: classRoom.entityId.id };
            await useCase.execute(input);
    
            const foundClassRoom = await repository.find(new Uuid(input.id));
            expect(foundClassRoom).toBeNull();
        });
    
        it("should throw an error when trying to delete a non-existent classroom", async () => {
            const nonExistentId = new Uuid().id;
            const input = { id: nonExistentId };
    
            await expect(useCase.execute(input)).rejects.toThrow(CustomNotFoundError);
        });
    });
});
