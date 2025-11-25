import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tamaños de iconos necesarios
const iconSizes = [
    // Favicon
    { size: 16, name: 'icon-16x16.png' },
    { size: 32, name: 'icon-32x32.png' },

    // Apple Touch Icons
    { size: 57, name: 'apple-icon-57x57.png' },
    { size: 60, name: 'apple-icon-60x60.png' },
    { size: 72, name: 'icon-72x72.png' },
    { size: 76, name: 'apple-icon-76x76.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 114, name: 'apple-icon-114x114.png' },
    { size: 120, name: 'apple-icon-120x120.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 180, name: 'apple-icon-180x180.png' },

    // PWA Icons
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
    const inputFile = path.join(__dirname, 'public', 'WishTracker01.png');
    const outputDir = path.join(__dirname, 'public');

    // Verificar que el archivo fuente existe
    if (!fs.existsSync(inputFile)) {
        console.error('Archivo fuente no encontrado:', inputFile);
        return;
    }

    console.log('Generando iconos desde:', inputFile);

    for (const icon of iconSizes) {
        const outputFile = path.join(outputDir, icon.name);

        try {
            await sharp(inputFile)
                .resize(icon.size, icon.size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(outputFile);

            console.log(`✓ Generado: ${icon.name} (${icon.size}x${icon.size})`);
        } catch (error) {
            console.error(`✗ Error generando ${icon.name}:`, error.message);
        }
    }

    console.log('\n¡Todos los iconos generados exitosamente!');
}

generateIcons().catch(console.error);