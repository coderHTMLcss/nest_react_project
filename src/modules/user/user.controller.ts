import { Body, Controller, Delete, Patch, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdatePasswordUserDTO, UpdateUserDTO } from './dto'
import { JwtAuthGuard } from 'src/quards/jwt-quard'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiTags('API')
    @ApiResponse({ status: 200, type: UpdateUserDTO })
    @UseGuards(JwtAuthGuard)
    @Patch()
    updateUser(
        @Body() updateDto: UpdateUserDTO,
        @Req() request
    ): Promise<UpdateUserDTO> {
        const user = request.user
        return this.userService.updateUser(user.id, updateDto)
    }

    @ApiTags('API')
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    updatePasswordUser(
        @Body() updatePasswordUserDto: UpdatePasswordUserDTO,
        @Req() request
    ): Promise<UpdatePasswordUserDTO> {
        const user = request.user
        return this.userService.updatePasswordUser(
            user.id,
            updatePasswordUserDto
        )
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteUser(@Req() request): Promise<boolean> {
        const user = request.user
        return this.userService.deleteUser(user.id)
    }
}
