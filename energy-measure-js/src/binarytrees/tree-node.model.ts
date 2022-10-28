export class TreeNode {
    constructor(
        private left: TreeNode,
        private right: TreeNode,
    ) { }

    check(): number {
        if (this.left) {
            return 1 + this.left.check() + this.right.check()
        }
        else {
            return 1
        }
    }
}
