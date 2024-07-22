import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    userName: string

    @ApiProperty()
    @IsString()
    email: string

    @IsString()
    password: string
}

export class UpdateUserDTO {
    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    userName: string

    @ApiProperty()
    @IsString()
    email: string
}

export class UpdatePasswordUserDTO {
    @ApiProperty()
    @IsString()
    oldPassword: string

    @ApiProperty()
    @IsString()
    newPassword: string
}
