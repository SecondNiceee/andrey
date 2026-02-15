import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runScript(scriptPath, scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Запускаю: ${scriptName}`);
    console.log(`${'='.repeat(60)}\n`);

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`\n❌ ${scriptName} завершился с ошибкой (код: ${code})`);
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      } else {
        console.log(`\n✅ ${scriptName} успешно завершился!`);
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runFullMigration() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     🚀 ПОЛНАЯ МИГРАЦИЯ PNG → WebP                          ║
║                                                            ║
║  Этот скрипт выполнит следующие шаги:                     ║
║  1. Конвертирует все PNG → WebP (качество 70%)            ║
║  2. Обновит все HTML файлы со ссылками на WebP            ║
║  3. Удалит все старые PNG файлы                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);

  try {
    // Шаг 1: Конвертация
    await runScript(
      path.join(__dirname, 'convert-all-to-webp.js'),
      'Конвертация PNG → WebP'
    );

    // Шаг 2: Обновление HTML
    await runScript(
      path.join(__dirname, 'update-html-comprehensive.js'),
      'Обновление HTML файлов'
    );

    // Шаг 3: Удаление PNG
    await runScript(
      path.join(__dirname, 'delete-old-png.js'),
      'Удаление старых PNG файлов'
    );

    console.log(`
╔════════════════════════════════════════════════════════════╗
║     ✨ МИГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!                         ║
║                                                            ║
║  ✅ Все PNG файлы конвертированы в WebP                   ║
║  ✅ Все HTML файлы обновлены                              ║
║  ✅ Старые PNG файлы удалены                              ║
║                                                            ║
║  🎉 Твой проект полностью перешёл на WebP!               ║
╚════════════════════════════════════════════════════════════╝
    `);

  } catch (error) {
    console.error(`
╔════════════════════════════════════════════════════════════╗
║     ❌ ОШИБКА МИГРАЦИИ                                     ║
║                                                            ║
║  ${error.message}
║                                                            ║
║  Попробуй запустить скрипты вручную по отдельности       ║
╚════════════════════════════════════════════════════════════╝
    `);
    process.exit(1);
  }
}

runFullMigration();
