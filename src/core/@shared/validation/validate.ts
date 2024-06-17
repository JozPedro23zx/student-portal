import { validateSync } from 'class-validator';
import { NotificationErrorInterface } from './notification-interface';

export abstract class ClassValidator {
    validate(notification: NotificationErrorInterface, data: any, fields: string[]): boolean{
        const errors = validateSync(data, {groups: fields})
        if (errors.length) {
            for (const error of errors) {
                const field = error.property;
                Object.values(error.constraints!).forEach((message) => {
                  notification.addError({message, field});
                });
            }
        }
        return !errors.length;
    }
}