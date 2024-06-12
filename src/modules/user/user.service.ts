import { Injectable } from '@nestjs/common'
import { users } from 'src/moks'

@Injectable()
export class UserService {
    getUsers() {
        return users
    }
}
