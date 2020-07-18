export default class SoundChain {
  nodes: AudioNode[] = [];

  constructor() {}

  getLastNode(): AudioNode | undefined {
    return this.nodes[this.nodes.length - 1];
  }

  addNode(node: AudioNode) {
    const lastNode = this.getLastNode();
    lastNode?.connect(node);
    this.nodes.push(node);
  }
}
