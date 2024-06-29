import { Subject } from '@core/teacher/domain/value-object/subject.vo';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    HasMany,
    BelongsTo,
} from 'sequelize-typescript';

export type TeacherModelProps = {
    id: string;
    first_name: string;
    last_name: string;
    subject_specialization: SubjectModel[];
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number: string;
};

export type SubjectModelProps = {
    id: string;
    type: string;
    teacherId: string;
};

@Table({
    tableName: 'teachers',
    timestamps: true,
})
export class TeacherModel extends Model<TeacherModelProps> {
    @PrimaryKey
    @Column({ allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare first_name: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare last_name: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare date_of_birth: Date;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare street: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare number: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare city: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare phone_number: string;

    @HasMany(() => SubjectModel)
    declare subject_specialization: SubjectModel[];
}

@Table({
    tableName: 'subjects',
    timestamps: true,
})
export class SubjectModel extends Model<SubjectModelProps> {
    @PrimaryKey
    @Column({ allowNull: false, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare type: string;

    @ForeignKey(() => TeacherModel)
    @Column({ allowNull: false, type: DataType.UUID })
    declare teacherId: string;

    @BelongsTo(() => TeacherModel)
    declare teacher: TeacherModel;
}
