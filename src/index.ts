import transform from './jsonToJava';
import os from 'os';
import fs from 'fs/promises';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const homedir = require('os').homedir();

async function readStdin(stream: NodeJS.ReadStream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const main = async () => {
  const body = await readStdin(process.stdin);
  const temp = os.tmpdir();

  await fs.writeFile(`${temp}/json`, body);

  const { stdout, stderr } = await exec(
    `${homedir}/.cargo/bin/json_typegen ${temp}/json --output-mode kotlin/jackson`,
  );

  const input = stdout.split('\n');
  const javacode = transform(input);
  console.log(javacode);

  await fs.unlink(`${temp}/json`);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
