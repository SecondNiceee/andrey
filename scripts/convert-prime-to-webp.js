import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Массив всех Prime картинок
const primeImages = [
  'img/img-card-prime-energetik-adrenalin-new.png',
  'img/img-card-prime-energetik-adrenalin.png',
  'img/img-card-prime-energetik-ananas.png',
  'img/img-card-prime-energetik-arbuz-kivi.png',
  'img/img-card-prime-energetik-granat.png',
  'img/img-card-prime-energetik-klubnika-malina.png',
  'img/img-card-prime-energetik-mango-marakuya.png',
  'img/img-card-prime-energetik-persik-mango.png',
  'img/img-card-prime-energetik-smorodina.png',
  'img/img-card-prime-energetik-vinograd-new.png',
  'img/img-card-prime-energetik-vinograd.png',
  'img/img-card-prime-energetik-vishnya.png',
  'img/img-card-prime-ezhevika-myata-new.png',
  'img/img-card-prime-ezhevika-myata.png',
  'img/img-card-prime-five-sladkie-yagody.png',
  'img/img-card-prime-fruktovaya-zhvachka-juicy-fruit.png',
  'img/img-card-prime-granat-ananas-new.png',
  'img/img-card-prime-granat-ananas.png',
  'img/img-card-prime-greypfrut-kivi-new.png',
  'img/img-card-prime-greypfrut-kivi.png',
  'img/img-card-prime-kislaya-apelsinovaya-shipuchka-new.png',
  'img/img-card-prime-kislaya-apelsinovaya-shipuchka.png',
  'img/img-card-prime-kislaya-malinovaya-vata.png',
  'img/img-card-prime-kislaya-vinogradnaya-fanta.png',
  'img/img-card-prime-kislyy-ananas-malina.png',
  'img/img-card-prime-kislyy-barbaris.png',
  'img/img-card-prime-kislyy-mentos-vishnya.png',
  'img/img-card-prime-kislyy-mountain-dew.png',
  'img/img-card-prime-kislyy-tropicheskiy-miks-new.png',
  'img/img-card-prime-kislyy-tropicheskiy-miks.png',
  'img/img-card-prime-kislyy-vinograd-mango.png',
  'img/img-card-prime-kislyy-yablochnyy-shok.png',
  'img/img-card-prime-kivi-banan.png',
  'img/img-card-prime-klubnichno-bananovaya-eclipse.png',
  'img/img-card-prime-ledyanoy-grusheviy-limonad.png',
  'img/img-card-prime-love-is-ananas-kokos-new.png',
  'img/img-card-prime-love-is-ananas-kokos.png',
  'img/img-card-prime-morozniy-sprayt.png',
  'img/img-card-prime-orbit-babl-mint.png',
  'img/img-card-prime-persikovaya-huba-buba-new.png',
  'img/img-card-prime-persikovaya-huba-buba.png',
  'img/img-card-prime-smorodina-grusha.png',
  'img/img-card-prime-trident-malina-limon.png',
  'img/img-card-prime-turbo-yabloko-apelsin.png',
  'img/img-card-prime-vinogradniy-dirol.png',
  'img/img-card-prime-vishneviy-mentos-new.png',
  'img/img-card-prime-vishneviy-mentos.png',
  'img/img-card-prime1.png',
  'img/img-card-prime2.png',
  'img/img-card-prime3.png'
];

async function convertToWebP() {
  const rootDir = path.join(__dirname, '..');
  let successCount = 0;
  let errorCount = 0;
  const maxWidth = 600; // Максимальная ширина картинки в пикселях

  console.log('🚀 Начинаю конвертацию картинок Prime в WebP (размер: 600px)...\n');

  for (const imagePath of primeImages) {
    const fullPath = path.join(rootDir, imagePath);
    const webpPath = fullPath.replace(/\.png$/, '.webp');

    try {
      // Проверяем существует ли исходный файл
      await fs.access(fullPath);

      // Конвертируем в WebP с ресайзом до 600px и перезаписью файла
      await sharp(fullPath)
        .resize(maxWidth, maxWidth, {
          fit: 'inside', // Сохраняет пропорции, не обрезает
          withoutEnlargement: true // Не увеличивает если оригинал меньше
        })
        .webp({ quality: 85 })
        .toFile(webpPath);

      console.log(`✅ ${imagePath} → ${path.basename(webpPath)} (600px)`);
      successCount++;
    } catch (error) {
      console.log(`❌ Ошибка при обработке ${imagePath}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✨ Конвертация завершена!`);
  console.log(`✅ Успешно обработано: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📐 Все картинки ресайзены до 600px максимума`);
}

convertToWebP().catch(console.error);
