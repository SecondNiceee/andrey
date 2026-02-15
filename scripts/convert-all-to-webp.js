import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertAllToWebP() {
  const rootDir = path.join(__dirname, '..');
  const imgDirs = ['img', 'img-no'];
  let successCount = 0;
  let errorCount = 0;
  const processedImages = [];

  console.log('🚀 Начинаю конвертацию ВСЕХ изображений в WebP (качество: 70%)...\n');

  for (const imgDir of imgDirs) {
    const dirPath = path.join(rootDir, imgDir);
    
    try {
      // Проверяем существует ли директория
      await fs.access(dirPath);
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;

        const fullPath = path.join(dirPath, file);
        const webpFileName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const webpPath = path.join(dirPath, webpFileName);

        try {
          // Конвертируем в WebP с качеством 70%
          await sharp(fullPath)
            .webp({ quality: 70 })
            .toFile(webpPath);

          const relativePath = path.join(imgDir, webpFileName).replace(/\\/g, '/');
          processedImages.push({
            oldName: file,
            newName: webpFileName,
            dir: imgDir
          });

          console.log(`✅ ${imgDir}/${file} → ${webpFileName}`);
          successCount++;
        } catch (error) {
          console.log(`❌ Ошибка при обработке ${imgDir}/${file}: ${error.message}`);
          errorCount++;
        }
      }
    } catch (error) {
      console.log(`⚠️  Папка ${imgDir} не найдена, пропускаю...`);
    }
  }

  console.log(`\n✨ Конвертация завершена!`);
  console.log(`✅ Успешно обработано: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📊 Качество: 70% (оптимальное сжатие без видимой потери качества)\n`);

  // Сохраняем информацию о обработанных файлах для скрипта обновления HTML
  await fs.writeFile(
    path.join(__dirname, 'processed-images.json'),
    JSON.stringify(processedImages, null, 2),
    'utf-8'
  );

  console.log('💾 Информация о преобразованиях сохранена в processed-images.json');

  return processedImages;
}

convertAllToWebP().catch(console.error);
