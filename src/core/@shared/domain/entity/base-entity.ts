import { NotificationErrorInterface } from "@core/@shared/validation/notification-interface";
import { Uuid } from "../value-object/uuid.vo";
import { NotificationError } from "@core/@shared/validation/notification";

export default class BaseEntity{
    private _id: Uuid;
    private _notifications: NotificationErrorInterface;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(id?: Uuid, createdAt?: Date, updatedAt?: Date,){
        this._id = id ?? new Uuid();
        this._notifications = new NotificationError();
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }

    get entityId(): Uuid{
        return this._id;
    }

    get notifications(): NotificationErrorInterface{
        return this._notifications;
    }

    get createdAt(): Date{
        return this._createdAt;
    }

    get updatedAt(): Date{
        return this._updatedAt;
    }

    set newUpdatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
    }
}