import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { ClassRoomSequelizeRepository } from "./classroom-sequelize.repository";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { ClassRoomModel } from "./classroom.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { ClassRoomFakeBuilder } from "@core/classroom/domain/classroom.fake";

describe("ClassRoom sequelize repository integration tests", () => {
    let repository: ClassRoomSequelizeRepository;

    setupSequelize({ models: [ClassRoomModel] });

    beforeEach(async () => {
        repository = new ClassRoomSequelizeRepository(ClassRoomModel);
    });

    it("should create a new classroom", async () => {
        const classroom = ClassRoomFakeBuilder.aClassRoom().build();

        await repository.create(classroom);

        const model = await ClassRoomModel.findByPk(classroom.entityId.id);
        expect(model).toBeDefined();
        expect(model.grade_level).toBe(classroom.grade_level);
        expect(model.start_date.toISOString()).toBe(classroom.start_date.toISOString());
        expect(model.end_date.toISOString()).toBe(classroom.end_date.toISOString());
    });

    it("should update an existing classroom", async () => {
        const classroom = ClassRoomFakeBuilder.aClassRoom().build();

        await repository.create(classroom);

        classroom.changeGradeLevel("6th Grade");
        await repository.update(classroom);

        const model = await ClassRoomModel.findByPk(classroom.entityId.id);
        expect(model).toBeDefined();
        expect(model.grade_level).toBe("6th Grade");
    });

    it("should delete a classroom", async () => {
        const classroom = ClassRoomFakeBuilder.aClassRoom().build();

        await repository.create(classroom);
        await repository.delete(classroom.entityId);

        const model = await ClassRoomModel.findByPk(classroom.entityId.id);
        expect(model).toBeNull();
    });

    it("should find a classroom by id", async () => {
        const classroom = ClassRoomFakeBuilder.aClassRoom().build();

        await repository.create(classroom);

        const foundClassRoom = await repository.find(classroom.entityId);
        expect(foundClassRoom).toBeDefined();
        expect(foundClassRoom.grade_level).toBe(classroom.grade_level);
        expect(foundClassRoom.start_date.toISOString()).toBe(classroom.start_date.toISOString());
        expect(foundClassRoom.end_date.toISOString()).toBe(classroom.end_date.toISOString());
    });

    it("should return null if classroom is not found", async () => {
        const id = new Uuid();
        const foundClassRoom = await repository.find(id);
        expect(foundClassRoom).toBeNull();
    });

    it("should find classrooms by ids", async () => {
        const classroom1 = new ClassRoom({
            id: new Uuid(),
            grade_level: "5th Grade",
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
        });
        const classroom2 = new ClassRoom({
            id: new Uuid(),
            grade_level: "6th Grade",
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
        });

        await repository.create(classroom1);
        await repository.create(classroom2);

        const foundClassRooms = await repository.findByIds([classroom1.entityId, classroom2.entityId]);
        expect(foundClassRooms).toHaveLength(2);
        expect(foundClassRooms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ grade_level: "5th Grade" }),
                expect.objectContaining({ grade_level: "6th Grade" }),
            ])
        );
    });

    it("should find all classrooms", async () => {
        const classroom1 = new ClassRoom({
            id: new Uuid(),
            grade_level: "5th Grade",
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
        });
        const classroom2 = new ClassRoom({
            id: new Uuid(),
            grade_level: "6th Grade",
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-12-01'),
        });

        await repository.create(classroom1);
        await repository.create(classroom2);

        const foundClassRooms = await repository.findAll();
        expect(foundClassRooms).toHaveLength(2);
        expect(foundClassRooms).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ grade_level: "5th Grade" }),
                expect.objectContaining({ grade_level: "6th Grade" }),
            ])
        );
    });
});