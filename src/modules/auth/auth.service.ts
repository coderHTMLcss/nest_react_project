import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { CreateUserDTO } from '../user/dto'
import { AppError } from 'src/common/constants/errors'
import { UserLoginDTO } from './dto'
import * as bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service'
import { AuthUserResponse } from './response'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) {}
    async registerUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
        const existUser = await this.userService.findUserbyEmail(dto.email)
        if (existUser) throw new BadRequestException(AppError.USER_EXIST)
        return this.userService.createUser(dto)
    }

    async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
        const existUser = await this.userService.findUserbyEmail(dto.email)
        if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const validatePassword = await bcrypt.compare(
            dto.password,
            existUser.password
        )
        if (!validatePassword)
            throw new BadRequestException(AppError.WRONG_DATA)
        const user = await this.userService.publicUser(dto.email)
        const token = await this.tokenService.generateJwtToken(user)
        return { user, token }
    }
}
