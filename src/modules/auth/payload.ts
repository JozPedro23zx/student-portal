export type Payload = {
    email: string,
    password: string,
    realm_access: {
        roles: string[];
    };
}