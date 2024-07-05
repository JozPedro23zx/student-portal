import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
    {
        "id": "123",
        "email": "student@user.com",
        "password": "s123",
        "types": ["student"]
    },
    {
        "id": "456",
        "email": "teacher@user.com",
        "password": "t123",
        "types": ["teacher"]
    },
    {
        "id": "789",
        "email": "admin@user.com",
        "password": "a123",
        "types": ["admin", "teacher"]
    }
]

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) { }

    login(email: string, password: string) {

        let user = users.find((u)=> u.email === email)

        if(!user){
            throw new NotFoundException("User not found")
        }

        const payload = { 
            email,
            name: 'test',
            realm_access: {
                roles: user.types
            }
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
