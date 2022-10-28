import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandModule } from './command/command.module';
import {BinarytreesService} from "./binarytrees/binarytrees.service";
import { FastaService } from './fasta/fasta.service';
import { KNucleotideService } from './k-nucleotide/k-nucleotide.service';
import { RegexReduxService } from './regex-redux/regex-redux.service';

@Module({
  imports: [CommandModule],
  controllers: [AppController],
  providers: [AppService, BinarytreesService, FastaService, KNucleotideService, RegexReduxService],
})
export class AppModule {}
