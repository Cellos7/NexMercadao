export class ErroDeNegocio extends Error {
  constructor(mensagem, codigoHttp = 400) {
    super(mensagem);
    this.name = "ErroDeNegocio";
    this.codigoHttp = codigoHttp;
  }
}
