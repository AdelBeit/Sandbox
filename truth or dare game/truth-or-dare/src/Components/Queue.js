class Queue {
  constructor(e = []) {
    this.elements = e;
  }
  enqueue(e) {
    this.elements.push(e);
  }
  dequeue() {
    return this.elements.shift();
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  peek() {
    return !this.isEmpty() ? this.elements[0] : undefined;
  }
  length() {
    return this.elements.length;
  }
}

export default Queue;
