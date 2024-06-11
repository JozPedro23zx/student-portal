import { ValueObject } from "@core/@shared/domain/value-object/value-object";

type AddressProps = {
    street: string;
    number: string;
    city: string;
}

export class Address extends ValueObject{
    private _street: string;
    private _number: string;
    private _city: string;

    constructor(props: AddressProps){
        super();
        this._street = props.street
        this._number = props.number
        this._city = props.city
    }

    get street(): string{
        return this._street
    }

    get number(): string{
        return this._number
    }

    get city(): string{
        return this._city
    }
}