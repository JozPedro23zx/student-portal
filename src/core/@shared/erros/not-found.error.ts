export class CustomNotFoundError extends Error{
    constructor(id: string[] | string, className: string){
        const idsMessage = Array.isArray(id) ? id.join(', ') : id;
        super(`Not possible find any ${className} with id: ${idsMessage}`);
        this.name = 'NotFoundError';
    }
}