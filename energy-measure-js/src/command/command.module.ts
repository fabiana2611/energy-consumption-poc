import { Module } from '@nestjs/common';
import {CommandProcessService} from "./process.service";

@Module({
  providers: [CommandProcessService],
  exports: [CommandProcessService]
})
export class CommandModule {}
