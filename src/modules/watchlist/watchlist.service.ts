import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Watchlist } from './models/watchlist.model'
import { CreateAssetResponse } from './response'

@Injectable()
export class WatchlistService {
    constructor(
        @InjectModel(Watchlist)
        private readonly watchListRepository: typeof Watchlist
    ) {}
    async createAsset(user, dto): Promise<CreateAssetResponse> {
        const watchList = {
            user: user.id,
            name: dto.name,
            assetId: dto.assetId,
        }
        await this.watchListRepository.create(watchList)
        return watchList
    }

    async getUserAssets(userId: number): Promise<Watchlist[]> {
        try {
            return this.watchListRepository.findAll({ where: { user: userId } })
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAsset(userId: number, assetId: string): Promise<boolean> {
        await this.watchListRepository.destroy({
            where: { id: assetId, user: userId },
        })
        return true
    }
}
