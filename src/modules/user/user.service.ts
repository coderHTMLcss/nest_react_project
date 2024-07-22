import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './models/user.model'
import * as bcrypt from 'bcrypt'
import { CreateUserDTO, UpdatePasswordUserDTO, UpdateUserDTO } from './dto'
import { Watchlist } from '../watchlist/models/watchlist.model'
import { TokenService } from '../token/token.service'
import { AuthUserResponse } from '../auth/response'
import { AppError } from 'src/common/constants/errors'
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User,
        private readonly tokenService: TokenService
    ) {}

    async findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: { email: email },
            include: {
                model: Watchlist,
                required: false,
            },
        })
    }

    async findUserByID(id: number): Promise<User> {
        return this.userRepository.findOne({
            where: { id },
            include: {
                model: Watchlist,
                required: false,
            },
        })
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 10)
    }
    async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
        dto.password = await this.hashPassword(dto.password)
        await this.userRepository.create({
            firstName: dto.firstName,
            userName: dto.userName,
            email: dto.email,
            password: dto.password,
        })
        return dto
    }

    async publicUser(email: string): Promise<AuthUserResponse> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            attributes: { exclude: ['password'] },
            include: {
                model: Watchlist,
                required: false,
            },
        })
        const token = await this.tokenService.generateJwtToken(user)
        return { user, token }
    }

    async updateUser(
        userId: number,
        dto: UpdateUserDTO
    ): Promise<UpdateUserDTO> {
        await this.userRepository.update(dto, { where: { id: userId } })
        return dto
    }

    async updatePasswordUser(
        userId: number,
        dto: UpdatePasswordUserDTO
    ): Promise<any> {
        const { password } = await this.findUserByID(userId)
        const currentPassword = await bcrypt.compare(dto.oldPassword, password)
        if (!currentPassword)
            return new BadRequestException(AppError.WRONG_DATA)
        const newPassword = await this.hashPassword(dto.newPassword)
        const data = {
            password: newPassword,
        }
        return this.userRepository.update(data, { where: { id: userId } })
    }

    async deleteUser(id: number): Promise<boolean> {
        await this.userRepository.destroy({ where: { id } })
        return true
    }
}
