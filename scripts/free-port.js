import { execSync } from 'node:child_process';

const PORT = process.env.PORT || 3000;

try {
    const output = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
    const pids = [...new Set(
        output
            .split('\n')
            .filter((line) => line.includes('LISTENING'))
            .map((line) => line.trim().split(/\s+/).pop())
            .filter(Boolean)
    )];

    for (const pid of pids) {
        try {
            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        } catch {
            // el proceso ya no existe
        }
    }
} catch {
    // puerto libre
}
