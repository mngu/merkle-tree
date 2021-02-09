import createHash from "./utils/createHash";

type Leaf = {
  hash: string;
};
type Tree = Leaf[][];

class MerkleTree {
  private tree: Tree;

  constructor(data: string[]) {
    // Checking for data
    if (!Array.isArray(data) || data.some((value) => typeof value !== "string")) {
      throw new Error("Invalid data");
    }

    // Initializing the 1st level of tree
    this.tree = [data.map((value: string) => ({ hash: createHash(value) }))];

    if (this.tree[0].length !== 1) {
      this.generateTree();
    }
  }

  generateTree() {
    const currentTopLevel = this.tree[0];
    let nextLevel: Leaf[] = [];
    for (let i = 0; i < currentTopLevel.length; i += 2) {
      // Current Leaf is the last on current level
      if (!currentTopLevel[i + 1]) {
        nextLevel = [...nextLevel, currentTopLevel[i]];
        continue;
      }

      // Add a new Leaf with the neighbour hash
      nextLevel = [...nextLevel, { hash: createHash(`${currentTopLevel[i].hash}${currentTopLevel[i + 1].hash}`) }];
    }

    // Append top-level in tree
    this.tree = [nextLevel, ...this.tree];

    // Continue if we have not calculated a root-node yet
    if (this.tree[0].length > 1) {
      this.generateTree();
    }
  }

  root() {
    return this.level(0);
  }

  height() {
    return this.tree.length;
  }

  level(index: number) {
    return this.tree[index];
  }
}

export default MerkleTree;