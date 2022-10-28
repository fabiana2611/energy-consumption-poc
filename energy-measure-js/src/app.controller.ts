import {Controller, Get, Logger, Param} from '@nestjs/common';
import { AppService } from './app.service';
import {CommandProcessService} from "./command/process.service";

enum BENCHMARK{
  BINARY_TREE=0,
  FASTA=1,
  K_NUCLEOTIDE=2,
  REGEX_REDUX=3,
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  // PID value get from terminal
  private readonly pid = 18613;

  private energy;

  constructor(private readonly appService: AppService, private commandProcess: CommandProcessService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Value to test: 21
  @Get("/binarytrees")
  runBinarytrees(): void {
    const value = 21;
    const outcomeTop = "top_binarytrees";
    const avgTop = "top_avg_binarytrees";

    this.measureValues(outcomeTop, avgTop, BENCHMARK.BINARY_TREE, value);
  }

  @Get("/fasta")
  runFasta(): void {
    const value = 25000000;
    const outcomeTop = "top_fasta";
    const avgTop = "top_avg_fasta";

    this.measureValues(outcomeTop, avgTop, BENCHMARK.FASTA, value);
  }

  @Get("/knucleotide")
  runKNucleotide(): void {
    const outcomeTop = "top_knucleotide";
    const avgTop = "top_avg_knucleotide";

    this.measureValues(outcomeTop, avgTop, BENCHMARK.K_NUCLEOTIDE);
  }

  @Get("/regex-redux")
  runRegexRedux(): void {
    const outcomeTop = "top_regex_redux";
    const avgTop = "top_avg_regex_redux";

    this.measureValues(outcomeTop, avgTop, BENCHMARK.REGEX_REDUX);
  }

  measureValues(outcomeTop: string, avgTop: string, bench: BENCHMARK, value?: any) {
    // It's necessary wait 1s to start catching the values
    setTimeout( () => {
      this.commandProcess.startTop(this.pid, outcomeTop);

      // Wait one second for top be started
      setTimeout( () => {
        this.executeBenchmark(bench, value);

        // When process is finished the top can be stopped
        this.commandProcess.stopTop();

        // Measure the energy using ioreg in the end of the process
        this.commandProcess.execIoreg().then((x) => {
          this.energy = x;
        });

        // It's necessary to wait a second for the file be available and calculate the avg
        setTimeout(() => {
          this.commandProcess.calcAvgTop(outcomeTop, avgTop);

          //Get the avg from the file and print. It's necessary wait a second to access the file created previously
          setTimeout(async () => {
            await this.commandProcess.execPrint(avgTop).then((x) => {
              this.logger.log(`TOP AVG POWER: ${x}`);
              this.logger.log(`IOREG ENERGY: ${this.energy}`);
            });

            this.logger.log("THE END!!!!");
          }, 2000);

        }, 10000);

      }, 2000)

    }, 1000)
  }

  private executeBenchmark(benchmark: BENCHMARK, value?:any) {
    switch (benchmark) {
      case BENCHMARK.BINARY_TREE: this.appService.runBinaryTree(value); break;
      case BENCHMARK.FASTA: this.appService.runFasta(value); break;
      case BENCHMARK.K_NUCLEOTIDE: this.appService.runKNucleotide(); break;
      case BENCHMARK.REGEX_REDUX: this.appService.runRegexRedux(); break;
    }
  }
}
