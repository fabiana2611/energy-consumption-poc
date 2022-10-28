import {Injectable, Logger} from '@nestjs/common';
import {exec} from "child_process";

//https://github.com/rogerbf/ioreg
const ioreg = require('ioreg');

@Injectable()
export class CommandProcessService {
    private readonly logger = new Logger(CommandProcessService.name);

    /**
     * Ref: https://blog.mozilla.org/nnethercote/2015/08/26/what-does-the-os-x-activity-monitors-energy-impact-actually-measure/
     */
    public async startTop(pid: number, outFileName: string ){
        this.logger.log("[startTop...] OutFileName: " + outFileName);
        return this.executeCommand(`top -pid ${pid} -stats pid,command,cpu,mem,power -s 1| grep ${pid} > ${outFileName}.log`);
    }

    public async stopTop(): Promise<void> {
        this.logger.log("[stopTop...]");
        await this.executeCommand(`kill $(pgrep top)`);
    }

    public calcAvgTop(inFileName: string, outFileName: string){
        this.logger.log(`[calcAvgTop...] InFileName: ${inFileName}, OutFileName: ${outFileName}`);
        return this.executeCommand(`cat ${inFileName}.log | awk '{totalE+=$3; count++} END {print totalE/count}' > ${outFileName}.txt`);
    }

    public execPrint(fileName: string){
        this.logger.log("[execPrint] FileName: " + fileName);
        return this.executeCommand(`cat ${fileName}.txt`);
    }

    /**
     * Ref: https://www.rdegges.com/2022/how-to-calculate-the-energy-consumption-of-a-mac/
     */
    public execIoreg(){
        return new Promise((resolve, reject) => {
            ioreg('AppleSmartBattery')
                .then(result => {
                    const absValue = result[0].BatteryData.AdapterPower;
                    // wattHours
                    this.executeCommand(`bc -l <<< $(lldb --batch -o "print/f ${absValue}" | grep -o '$0 = [0-9.]*' | cut -c 6-)/60`)
                        .then(x => resolve(x)).catch(err => reject(err));
                }).catch(err => reject(err));
        });

    }

    private executeCommand(command: string) {
        return new Promise((resolve, reject) => {
            exec(
                command ,
                (err: Error | null, stdout, stderr) => {

                    if (err) {
                        console.log("Command: watt");
                        console.log(`stderr: ${stderr}`);
                        reject(err);
                    } else {
                        resolve(stdout);
                    }

                    this.logger.log(`The process was finished: [${command}]`);
                }
            );
        })
    }

}
