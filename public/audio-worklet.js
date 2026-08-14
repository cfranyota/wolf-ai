class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const inp = inputs[0];
    if (!inp || !inp[0]) return true;
    const chs = [];
    for (let c = 0; c < inp.length; c++) {
      chs.push(inp[c] ? inp[c].slice() : new Float32Array(128));
    }
    this.port.postMessage(chs, chs.map(b => b.buffer));
    return true;
  }
}
registerProcessor('wolf-capture', CaptureProcessor);
