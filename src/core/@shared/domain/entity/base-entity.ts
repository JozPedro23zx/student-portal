import { Uuid } from "../value-object/uuid.vo";

export default class BaseEntity{
    private _id: Uuid;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(id?: Uuid, createdAt?: Date, updatedAt?: Date,){
        this._id = id;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    get uuid(): Uuid{
        return this._id;
    }

    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }

    set updatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
    }
}