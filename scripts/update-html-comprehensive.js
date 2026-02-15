import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateHTMLComprehensive() {
  const rootDir = path.join(__dirname, '..');

  console.log('🚀 Обновляю ВСЕ HTML файлы для использования WebP изображений...\n');

  try {
    // Читаем информацию о обработанных файлах
    const processedImagesPath = path.join(__dirname, 'processed-images.json');
    let processedImages = [];

    try {
      processedImages = JSON.parse(
        await fs.readFile(processedImagesPath, 'utf-8')
      );
    } catch {
      console.log('⚠️  Файл processed-images.json не найден, буду искать все PNG -> WebP замены\n');
    }

    // Находим все HTML файлы в проекте
    const files = await fs.readdir(rootDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    console.log(`📄 Найдено HTML файлов: ${htmlFiles.length}`);
    console.log(`Файлы: ${htmlFiles.join(', ')}\n`);

    let totalReplacedCount = 0;
    let filesUpdated = 0;

    // Обновляем каждый HTML файл
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(rootDir, htmlFile);
      let htmlContent = await fs.readFile(htmlPath, 'utf-8');
      let fileReplacedCount = 0;

      // Способ 1: Используем processed-images.json если доступен
      if (processedImages.length > 0) {
        for (const image of processedImages) {
          // Заменяем разные варианты путей
          const patterns = [
            `./img/${image.oldName}`,
            `./img-no/${image.oldName}`,
            `img/${image.oldName}`,
            `img-no/${image.oldName}`,
          ];

          const newPath = image.dir === 'img' ? `./img/${image.newName}` : `./img-no/${image.newName}`;

          for (const pattern of patterns) {
            const regex = new RegExp(
              pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
              'g'
            );
            const matches = htmlContent.match(regex);
            if (matches) {
              htmlContent = htmlContent.replace(regex, newPath);
              fileReplacedCount += matches.length;
            }
          }
        }
      } else {
        // Способ 2: Прямое заменение всех PNG на WebP (если нет processed-images.json)
        const pngRegex = /([./]*img(?:-no)?\/[^"'\s>]+\.png)/gi;
        const matches = htmlContent.match(pngRegex);
        if (matches) {
          htmlContent = htmlContent.replace(pngRegex, (match) => {
            return match.replace(/\.png$/i, '.webp');
          });
          fileReplacedCount = matches.length;
        }
      }

      // Сохраняем если были изменения
      if (fileReplacedCount > 0) {
        await fs.writeFile(htmlPath, htmlContent, 'utf-8');
        console.log(`✅ ${htmlFile}: заменено ${fileReplacedCount} ссылок`);
        totalReplacedCount += fileReplacedCount;
        filesUpdated++;
      } else {
        console.log(`ℹ️  ${htmlFile}: изменений не требуется`);
      }
    }

    console.log(`\n✨ Обновление завершено!`);
    console.log(`✅ Обновлено файлов: ${filesUpdated}/${htmlFiles.length}`);
    console.log(`✅ Всего заменено ссылок: ${totalReplacedCount}`);

    if (totalReplacedCount > 0) {
      console.log(`\n📋 Следующий шаг: запусти "npm run delete-png" для удаления старых PNG файлов`);
    }
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    process.exit(1);
  }
}

updateHTMLComprehensive().catch(console.error);
