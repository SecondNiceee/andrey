import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateAllHTMLToWebP() {
  const rootDir = path.join(__dirname, '..');

  try {
    // Читаем информацию о обработанных файлах
    const processedImagesPath = path.join(__dirname, 'processed-images.json');
    const processedImages = JSON.parse(
      await fs.readFile(processedImagesPath, 'utf-8')
    );

    const htmlFiles = ['index.html', 'catalog.html', 'products.html'];
    let totalReplacedCount = 0;

    console.log('🚀 Обновляю HTML файлы для использования WebP изображений...\n');

    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(rootDir, htmlFile);

      try {
        let htmlContent = await fs.readFile(htmlPath, 'utf-8');
        let fileReplacedCount = 0;

        // Заменяем каждое изображение на WebP версию
        for (const image of processedImages) {
          const oldPath = `./img/${image.oldName}`;
          const newPath = `./img/${image.newName}`;

          // Используем глобальное заменение (случаи с разными форматами пути)
          const regex = new RegExp(
            `\\./${image.dir}/${image.oldName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
            'g'
          );
          htmlContent = htmlContent.replace(regex, newPath);

          if (htmlContent.includes(newPath)) {
            fileReplacedCount++;
          }
        }

        // Сохраняем обновленный HTML
        await fs.writeFile(htmlPath, htmlContent, 'utf-8');

        if (fileReplacedCount > 0) {
          console.log(`✅ ${htmlFile}: заменено ${fileReplacedCount} ссылок`);
          totalReplacedCount += fileReplacedCount;
        }
      } catch (error) {
        console.log(`⚠️  ${htmlFile} не найден, пропускаю...`);
      }
    }

    console.log(`\n✨ Обновление завершено!`);
    console.log(`✅ Всего заменено ссылок: ${totalReplacedCount}`);
    console.log(`📂 Обновлены HTML файлы`);
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    process.exit(1);
  }
}

updateAllHTMLToWebP().catch(console.error);
