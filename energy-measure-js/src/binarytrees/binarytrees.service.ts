import {Injectable, Logger} from '@nestjs/common';
import {TreeNode} from "./tree-node.model";

/**
 * Ref: https://github.com/greensoftwarelab/Energy-Languages/tree/master/TypeScript/binary-trees
 * The Computer Language Benchmarks Game - http://benchmarksgame.alioth.debian.org/
 */
@Injectable()
export class BinarytreesService {
    private readonly logger = new Logger(BinarytreesService.name);

    run(value: number) {

        this.logger.log("###############");

        const n = value ? value : 21;
        const minDepth = 4
        const maxDepth = Math.max(minDepth + 2, n);
        const stretchDepth = maxDepth + 1

        let check = this.bottomUpTree(stretchDepth).check()
        this.logger.log("stretch tree of depth " + stretchDepth + "\t check: " + check)

        const longLivedTree = this.bottomUpTree(maxDepth)
        for (let depth=minDepth; depth<=maxDepth; depth+=2) {
            let iterations = 1 << (maxDepth - depth + minDepth)

            check = 0;
            for (let i=1; i<=iterations; i++) {
                check += this.bottomUpTree(depth).check()
            }

            this.logger.log(iterations + "\t trees of depth " + depth + "\t check: " + check)
        }

        this.logger.log("long lived tree of depth " + maxDepth + "\t check: " + longLivedTree.check())

        this.logger.log("###############");

    }

    private bottomUpTree(depth: number): TreeNode {
        if (depth > 0) {
            // "new TreeNode(" must be on same line as "return"
            return new TreeNode(
                this.bottomUpTree(depth-1),
                this.bottomUpTree(depth-1)
            )
        }
        else {
            return new TreeNode(undefined,undefined)
        }
    }

}
