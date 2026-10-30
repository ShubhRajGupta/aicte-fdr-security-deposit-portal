import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(payload: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1e3a8a', // Deep Government Navy
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
