// Simple icon generator for PWA
// This creates base64 encoded PNG icons for immediate use

function generateIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1a4d2e');
    gradient.addColorStop(1, '#2d5f3f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Card shape
    const cardSize = size * 0.6;
    const cardX = (size - cardSize) / 2;
    const cardY = (size - cardSize) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(cardX, cardY, cardSize, cardSize, size * 0.05);
    ctx.fill();
    
    // Card border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = size * 0.01;
    ctx.roundRect(cardX, cardY, cardSize, cardSize, size * 0.05);
    ctx.stroke();
    
    // Spade symbol
    ctx.fillStyle = '#000000';
    const centerX = size / 2;
    const centerY = size / 2;
    const spadeSize = size * 0.15;
    
    // Simple spade shape
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - spadeSize);
    ctx.quadraticCurveTo(centerX - spadeSize, centerY, centerX - spadeSize/2, centerY + spadeSize/2);
    ctx.quadraticCurveTo(centerX, centerY + spadeSize/3, centerX, centerY + spadeSize/3);
    ctx.quadraticCurveTo(centerX, centerY + spadeSize/3, centerX + spadeSize/2, centerY + spadeSize/2);
    ctx.quadraticCurveTo(centerX + spadeSize, centerY, centerX, centerY - spadeSize);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#ffd700';
    ctx.font = `bold ${size * 0.12}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('BURACO', centerX, size - size * 0.15);
    
    return canvas.toDataURL('image/png');
}

// Generate and save icons
console.log('Generating PWA icons...');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const iconData = generateIcon(size);
    console.log(`Generated ${size}x${size} icon (${Math.round(iconData.length/1024)}KB)`);
    
    // Create download link for manual saving
    const link = document.createElement('a');
    link.download = `icon-${size}x${size}.png`;
    link.href = iconData;
    link.textContent = `Download ${size}x${size}`;
    link.style.display = 'block';
    link.style.margin = '5px';
    document.body.appendChild(link);
});