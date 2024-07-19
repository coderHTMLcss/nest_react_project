import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDTO } from '../user/dto'
import { UserLoginDTO } from './dto'
import { AuthUserResponse } from './response'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/quards/jwt-quard'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @ApiTags('API')
    @ApiResponse({
        status: 201,
        type: AuthUserResponse,
    })
    @Post('register')
    register(@Body() dto: CreateUserDTO): Promise<AuthUserResponse> {
        return this.authService.registerUser(dto)
    }
    @ApiTags('API')
    @ApiResponse({
        status: 200,
        type: AuthUserResponse,
    })
    @Post('login')
    login(@Body() dto: UserLoginDTO): Promise<AuthUserResponse> {
        return this.authService.loginUser(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('test')
    test() {
        return true
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-public-user-info')
    getPublic(@Req() request) {
        const user = request.user
        return this.userService.publicUser(user.email)
    }
}
