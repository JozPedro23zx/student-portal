import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    login(@Body() body) {
      return this.authService.login(body.email, body.password);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Get()
    protected() {
      return { name: 'ok' };
    }
}
