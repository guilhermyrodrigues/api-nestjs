import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporting PrismaService so it can be used in other modules
})
export class PrismaModule {}
