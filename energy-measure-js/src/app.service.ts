import { Injectable } from '@nestjs/common';
import {BinarytreesService} from "./binarytrees/binarytrees.service";
import {FastaService} from "./fasta/fasta.service";
import {KNucleotideService} from "./k-nucleotide/k-nucleotide.service";
import {RegexReduxService} from "./regex-redux/regex-redux.service";

@Injectable()
export class AppService {

  constructor(private binaryTree: BinarytreesService, private fastaService: FastaService,
              private knucleotideService: KNucleotideService, private regexReduxService: RegexReduxService) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  runBinaryTree(value: number): void {
    this.binaryTree.run(value);
  }

  runFasta(value: number): void {
    this.fastaService.run(value);
  }

  runKNucleotide(): void {
    this.knucleotideService.run();
  }

  runRegexRedux(): void {
    this.regexReduxService.run();
  }
}
