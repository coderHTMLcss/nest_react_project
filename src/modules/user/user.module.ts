import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './models/user.model'
import { TokenModule } from '../token/token.module'
@Module({
    imports: [SequelizeModule.forFeature([User]), TokenModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
