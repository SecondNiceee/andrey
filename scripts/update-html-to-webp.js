import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Массив всех Prime картинок для замены
const primeImages = [
  'img-card-prime-energetik-adrenalin-new.png',
  'img-card-prime-energetik-adrenalin.png',
  'img-card-prime-energetik-ananas.png',
  'img-card-prime-energetik-arbuz-kivi.png',
  'img-card-prime-energetik-granat.png',
  'img-card-prime-energetik-klubnika-malina.png',
  'img-card-prime-energetik-mango-marakuya.png',
  'img-card-prime-energetik-persik-mango.png',
  'img-card-prime-energetik-smorodina.png',
  'img-card-prime-energetik-vinograd-new.png',
  'img-card-prime-energetik-vinograd.png',
  'img-card-prime-energetik-vishnya.png',
  'img-card-prime-ezhevika-myata-new.png',
  'img-card-prime-ezhevika-myata.png',
  'img-card-prime-five-sladkie-yagody.png',
  'img-card-prime-fruktovaya-zhvachka-juicy-fruit.png',
  'img-card-prime-granat-ananas-new.png',
  'img-card-prime-granat-ananas.png',
  'img-card-prime-greypfrut-kivi-new.png',
  'img-card-prime-greypfrut-kivi.png',
  'img-card-prime-kislaya-apelsinovaya-shipuchka-new.png',
  'img-card-prime-kislaya-apelsinovaya-shipuchka.png',
  'img-card-prime-kislaya-malinovaya-vata.png',
  'img-card-prime-kislaya-vinogradnaya-fanta.png',
  'img-card-prime-kislyy-ananas-malina.png',
  'img-card-prime-kislyy-barbaris.png',
  'img-card-prime-kislyy-mentos-vishnya.png',
  'img-card-prime-kislyy-mountain-dew.png',
  'img-card-prime-kislyy-tropicheskiy-miks-new.png',
  'img-card-prime-kislyy-tropicheskiy-miks.png',
  'img-card-prime-kislyy-vinograd-mango.png',
  'img-card-prime-kislyy-yablochnyy-shok.png',
  'img-card-prime-kivi-banan.png',
  'img-card-prime-klubnichno-bananovaya-eclipse.png',
  'img-card-prime-ledyanoy-grusheviy-limonad.png',
  'img-card-prime-love-is-ananas-kokos-new.png',
  'img-card-prime-love-is-ananas-kokos.png',
  'img-card-prime-morozniy-sprayt.png',
  'img-card-prime-orbit-babl-mint.png',
  'img-card-prime-persikovaya-huba-buba-new.png',
  'img-card-prime-persikovaya-huba-buba.png',
  'img-card-prime-smorodina-grusha.png',
  'img-card-prime-trident-malina-limon.png',
  'img-card-prime-turbo-yabloko-apelsin.png',
  'img-card-prime-vinogradniy-dirol.png',
  'img-card-prime-vishneviy-mentos-new.png',
  'img-card-prime-vishneviy-mentos.png',
  'img-card-prime1.png',
  'img-card-prime2.png',
  'img-card-prime3.png'
];

async function updateHTMLtoWebP() {
  const rootDir = path.join(__dirname, '..');
  const htmlPath = path.join(rootDir, 'index.html');

  try {
    let htmlContent = await fs.readFile(htmlPath, 'utf-8');
    let replacedCount = 0;

    console.log('🚀 Обновляю HTML для использования WebP картинок...\n');

    // Заменяем каждую PNG картинку на WebP
    for (const imageName of primeImages) {
      const pngPath = `./img/${imageName}`;
      const webpPath = pngPath.replace(/\.png$/, '.webp');

      if (htmlContent.includes(pngPath)) {
        htmlContent = htmlContent.replace(new RegExp(pngPath.replace(/\./g, '\\.'), 'g'), webpPath);
        console.log(`✅ ${imageName} → ${path.basename(webpPath)}`);
        replacedCount++;
      }
    }

    // Сохраняем обновленный HTML
    await fs.writeFile(htmlPath, htmlContent, 'utf-8');

    console.log(`\n✨ Обновление завершено!`);
    console.log(`✅ Заменено ссылок: ${replacedCount}`);
  } catch (error) {
    console.error(`❌ Ошибка: ${error.message}`);
    process.exit(1);
  }
}

updateHTMLtoWebP().catch(console.error);
