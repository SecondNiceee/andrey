import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteOldPNG() {
  const rootDir = path.join(__dirname, '..');
  const imgDirs = ['img', 'img-no'];
  let deleteCount = 0;
  let errorCount = 0;

  console.log('🗑️  Начинаю удаление старых PNG файлов...\n');

  try {
    // Читаем информацию о обработанных файлах
    const processedImagesPath = path.join(__dirname, 'processed-images.json');
    const processedImages = JSON.parse(
      await fs.readFile(processedImagesPath, 'utf-8')
    );

    // Группируем файлы по директориям
    const imagesByDir = {};
    for (const image of processedImages) {
      if (!imagesByDir[image.dir]) {
        imagesByDir[image.dir] = [];
      }
      imagesByDir[image.dir].push(image.oldName);
    }

    // Удаляем PNG файлы
    for (const [dir, fileNames] of Object.entries(imagesByDir)) {
      const dirPath = path.join(rootDir, dir);

      for (const fileName of fileNames) {
        const filePath = path.join(dirPath, fileName);

        try {
          // Проверяем что файл существует перед удалением
          await fs.access(filePath);
          await fs.unlink(filePath);
          console.log(`✅ Удален: ${dir}/${fileName}`);
          deleteCount++;
        } catch (error) {
          console.log(`⚠️  Не удалось удалить ${dir}/${fileName}: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✨ Удаление завершено!`);
    console.log(`✅ Успешно удалено: ${deleteCount} файлов`);
    console.log(`⚠️  Ошибок: ${errorCount}`);
    console.log(`\n💾 WebP файлы остались в директориях img/ и img-no/`);
  } catch (error) {
    console.error(`❌ Критическая ошибка: ${error.message}`);
    console.error('Убедитесь, что файл processed-images.json существует!');
    process.exit(1);
  }
}

deleteOldPNG().catch(console.error);
