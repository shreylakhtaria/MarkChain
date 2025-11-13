import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { BlockchainResolver } from './blockchain.resolver';
import { IPFSService } from './ipfs.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule)
  ],
  providers: [
    BlockchainService, 
    BlockchainResolver, 
    IPFSService
  ],
  exports: [
    BlockchainService, 
    IPFSService
  ],
})
export class BlockchainModule {}