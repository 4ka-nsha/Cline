import { spawn } from 'node:child_process';

const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';

const targets = [
  { name: 'server', args: ['run', 'dev', '--workspace', 'server'] },
  { name: 'web', args: ['run', 'dev', '--workspace', 'web'] },
];

const children = [];

function run({ name, args }) {
  const child = spawn(npm, args, { cwd: process.cwd(), env: process.env, shell: isWin });
  children.push(child);
  const tag = `[${name}] `;
  const pipe = (stream, target) => {
    stream.setEncoding('utf8');
    let buf = '';
    stream.on('data', (chunk) => {
      buf += chunk;
      const lines = buf.split(/\r?\n/);
      buf = lines.pop() ?? '';
      for (const line of lines) target.write(tag + line + '\n');
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => {
    process.stdout.write(`${tag}exited with code ${code}\n`);
    shutdown(code ?? 0);
  });
}

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) {
    if (!c.killed) c.kill();
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('KrishiFlow dev: starting server + web...');
targets.forEach(run);
