import app from "./app.js";
export default function start(
  port: number | undefined | string = 3000,
  domain: string | undefined = "http://localhost"
) {
  app.listen(port || 3000, () => {
    console.log(`App listening on port ${domain}:${port}`);
  });
}
