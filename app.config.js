import 'dotenv/config';

export default () => ({
  expo: {
    name: "CyberGuardian",
    slug: "cyberguardian",
    version: "1.0.0",
    android: {
      permissions : [
        "android.permission.INTERNET",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_EXTERNAL_STORAGE",        
      ],
    },
    ios: {
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Precisamos acessar sua galeria para selecionar fotos (opcional).",
        NSDocumentsFolderUsageDescription: "Precisamos acessar seus documentos para selecionar arquivos.",
      }
    },
    extra: {
      VIRUS_TOTAL_API_KEY: process.env.VIRUS_TOTAL_API_KEY,
    },
    newArchEnabled: true,
  },
});

