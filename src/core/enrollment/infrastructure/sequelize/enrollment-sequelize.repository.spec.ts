import { setupSequelize } from "@core/@shared/infrastructure/repository/sequelize/setup-helper";
import { EnrollmentSequelizeRepository } from "./enrollment-sequelize.repository";
import { EnrollmentModel } from "./enrollment.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { EnrollmentFakeBuilder } from "@core/enrollment/domain/enrollment.fake";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { EnrollmentStatus, Status } from "@core/enrollment/domain/value-object/enrollmentStatus";

describe("Enrollment repository unit tests", () => {
    let repository: EnrollmentSequelizeRepository;

    setupSequelize({ models: [EnrollmentModel] });

    beforeEach(async () => {
        repository = new EnrollmentSequelizeRepository(EnrollmentModel);
    })

    it('should create a new enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        const enrollmentCreated = await repository.find(enrollment.entityId);
        expect(enrollmentCreated!.toJSON()).toStrictEqual(enrollment.toJSON());
    });

    it('should find an enrollment by id', async () => {
        const uuid = new Uuid();
        let enrollmentFound = await repository.find(uuid);
        expect(enrollmentFound).toBeNull();

        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        enrollmentFound = await repository.find(enrollment.entityId);
        expect(enrollment.toJSON()).toStrictEqual(enrollmentFound!.toJSON());
    });

    it('should return all enrollments', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        const enrollments = await repository.findAll();
        expect(enrollments).toHaveLength(1);
        expect(enrollments[0].toJSON()).toEqual(enrollment.toJSON());
    });

    it('should throw error on update when an enrollment is not found', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await expect(repository.update(enrollment)).rejects.toThrow(CustomNotFoundError);
    });

    it('should find an enrollment by student ID', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
        await repository.create(enrollment);

        const foundEnrollment = await repository.findByStudent(new Uuid(enrollment.student_id));

        expect(foundEnrollment).not.toBeNull();
        expect(foundEnrollment!.toJSON()).toStrictEqual(enrollment.toJSON());
    });

    it('should return null if no enrollment is found by student ID', async () => {
        const nonExistentStudentId = new Uuid();
        const foundEnrollment = await repository.findByStudent(nonExistentStudentId);

        expect(foundEnrollment).toBeNull();
    });

    it('should find enrollments by class ID', async () => {
        const enrollment1 = EnrollmentFakeBuilder.anEnrollment().withClassId("675e8a19-de0a-4827-a894-1241a283d5d0").build();
        const enrollment2 = EnrollmentFakeBuilder.anEnrollment().withClassId("34799a41-2930-4e4c-bffb-49df5afe9a8d").build();
        const enrollment3 = EnrollmentFakeBuilder.anEnrollment().withClassId("34799a41-2930-4e4c-bffb-49df5afe9a8d").build();

        await repository.create(enrollment1);
        await repository.create(enrollment2);
        await repository.create(enrollment3);

        const foundEnrollments = await repository.findByClassRoom(new Uuid("34799a41-2930-4e4c-bffb-49df5afe9a8d"));

        expect(foundEnrollments).toHaveLength(2);
        expect(foundEnrollments.map(e => e.toJSON())).toEqual(
            expect.arrayContaining([enrollment2.toJSON(), enrollment3.toJSON()])
        );
    });

    it('should return an empty array if no enrollments are found by class ID', async () => {
        const classId = new Uuid().id;

        const foundEnrollments = await repository.findByClassRoom(new Uuid(classId));

        expect(foundEnrollments).toHaveLength(0);
    });

    it('should update an enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().withStatus(EnrollmentStatus.create(Status.ENROLLED)).build();
        await repository.create(enrollment);

        enrollment.updateStatus(EnrollmentStatus.create(Status.COMPLETED));

        await repository.update(enrollment);

        const updatedEnrollment = await repository.find(enrollment.entityId);
        expect(updatedEnrollment!.toJSON()).toEqual(enrollment.toJSON());
    });

    it('should throw error on delete when an enrollment is not found', async () => {
        const uuid = new Uuid();
        await expect(repository.delete(uuid)).rejects.toThrow(CustomNotFoundError);
    });

    it('should delete an enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build()
        await repository.create(enrollment);

        await repository.delete(enrollment.entityId);

        const deletedEnrollment = await repository.find(enrollment.entityId);
        expect(deletedEnrollment).toBeNull();
    });
})