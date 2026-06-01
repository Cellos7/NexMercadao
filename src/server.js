import { buildApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const server = buildApp();

server.listen(port, () => {
  console.log(`NexLog Mercadao rodando em http://localhost:${port}`);
});
