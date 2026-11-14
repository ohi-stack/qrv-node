// Validate that every installed gRPC JS package in the Firebase dependency tree is patched.
import { execFileSync } from 'node:child_process';

const requiredVersion = '1.14.6';
let dependencyTree;
try {
  dependencyTree = JSON.parse(execFileSync(
    'npm', ['ls', '@grpc/grpc-js', '--all', '--json'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  ));
} catch (error) {
  console.error('Unable to validate installed gRPC tree; npm ls reported an error.');
  console.error(error.stderr?.toString()?.slice(0, 3000) || error.message);
  process.exit(1);
}

const found = [];
function visit(node, path = []) {
  for (const [name, child] of Object.entries(node.dependencies || {})) {
    const next = [...path, name];
    if (name === '@grpc/grpc-js') found.push({ version: child.version, path: next.join(' > ') });
    visit(child, next);
  }
}
visit(dependencyTree);
if (found.length === 0) {
  throw new Error('Expected @grpc/grpc-js in the Firebase Firestore dependency tree; cannot establish remediation');
}
const unsafe = found.filter((item) => item.version !== requiredVersion);
if (unsafe.length) {
  console.error('Unpatched or unexpected gRPC installations:', JSON.stringify(unsafe));
  process.exit(1);
}
console.log('Patched @grpc/grpc-js versions verified:', JSON.stringify(found));
