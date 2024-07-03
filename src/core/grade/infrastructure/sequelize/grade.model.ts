import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
} from 'sequelize-typescript';

export type GradeModelProps = {
    id: string;
    student_id: string;
    subject: string;
    exam: number;
    assignment: number;
    others: number;
    createdAt: Date;
    updatedAt: Date;
}

@Table({
    tableName: 'grades',
    timestamps: false,
})
export class GradeModel extends Model<GradeModelProps> {

    @PrimaryKey
    @Column({ allowNull: false, type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.UUID })
    declare student_id: string;
    
    @Column({ allowNull: false, type: DataType.STRING(255)})
    declare subject: string;

    @Column({ allowNull: false, type: DataType.FLOAT })
    declare exam: number;

    @Column({ allowNull: false, type: DataType.FLOAT })
    declare assignment: number;

    @Column({ allowNull: false, type: DataType.FLOAT })
    declare others: number;

    @Column({ allowNull: false, type: DataType.DATE })
    declare createdAt: Date;
  
    @Column({ allowNull: false, type: DataType.DATE })
    declare updatedAt: Date;
}
