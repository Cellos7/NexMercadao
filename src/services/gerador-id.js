export class GeradorId {
  constructor() {
    this.atual = 1;
  }

  proximo(prefixo) {
    const base = Date.now().toString(36);
    const id = `${prefixo}-${base}-${String(this.atual).padStart(3, "0")}`;
    this.atual += 1;
    return id;
  }
}
