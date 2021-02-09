import MerkleTree from "./MerkleTree";
import createHash from "./utils/createHash";

describe("MerkleTree", () => {
  it.each([
    ["string"],
    [["string", 1]],
    [{ object: 1 }],
    [[{ object: 1 }, "string"]],
  ])("should throw if data is not valid", (data) => {
    expect(() => new MerkleTree(data as any)).toThrow("Invalid data");
  });

  it("should generate correct chain of hash", () => {
    const tree = new MerkleTree(["test1", "test2", "test3", "test4"]);
    const hash01 = createHash("test1");
    const hash02 = createHash("test2");
    const hash03 = createHash("test3");
    const hash04 = createHash("test4");
    const hash11 = createHash(`${hash01}${hash02}`);
    const hash12 = createHash(`${hash03}${hash04}`);
    const hash21 = createHash(`${hash11}${hash12}`);

    expect(tree.level(2)[0].hash).toBe(hash01);
    expect(tree.level(2)[1].hash).toBe(hash02);
    expect(tree.level(2)[2].hash).toBe(hash03);
    expect(tree.level(2)[3].hash).toBe(hash04);
    expect(tree.level(1)[0].hash).toBe(hash11);
    expect(tree.level(1)[1].hash).toBe(hash12);
    expect(tree.level(0)[0].hash).toBe(hash21);
  });

  it.each([
    [["test1"], 1],
    [["test1", "test2"], 2],
    [["test1", "test2", "test3"], 3],
    [["test1", "test2", "test3", "test4"], 3],
    [["test1", "test2", "test3", "test4", "test5"], 4],
    [["test1", "test2", "test3", "test4", "test5", "test6"], 4],
    [["test1", "test2", "test3", "test4", "test5", "test6", "test7"], 4],
    [["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"], 4],
    [["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9"], 5],
  ])("should generate a MerkleTree of correct height", (data, expectedHeight) => {
    const tree = new MerkleTree(data);

    expect(tree.height()).toBe(expectedHeight);
  });

  it("should return a level", () => {
    const tree = new MerkleTree(["test1", "test2", "test3"]);

    expect(tree.level(0)).toHaveLength(1);
    expect(tree.level(1)).toHaveLength(2);
    expect(tree.level(2)).toHaveLength(3);
    expect(tree.level(3)).toBeUndefined();
  });
})