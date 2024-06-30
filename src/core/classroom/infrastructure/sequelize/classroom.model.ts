import { Column, DataType, Model, PrimaryKey, Table, CreatedAt, UpdatedAt } from "sequelize-typescript";

export type ClassRoomModelProps = {
    id: string;
    grade_level: string;
    start_date: Date;
    end_date: Date;
    createdAt: Date;
    updatedAt: Date;
}

@Table({ tableName: 'classroom', timestamps: true })
export class ClassRoomModel extends Model<ClassRoomModelProps> {
    @PrimaryKey
    @Column({ allowNull: false, type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING })
    declare grade_level: string;

    @Column({ allowNull: false, type: DataType.DATE })
    declare start_date: Date;

    @Column({ allowNull: false, type: DataType.DATE })
    declare end_date: Date;

    @CreatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    declare updatedAt: Date;
}
