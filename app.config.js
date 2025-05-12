import 'dotenv/config';

export default () => ({
  expo: {
    name: "seu-app",
    slug: "seu-app",
    version: "1.0.0",
    extra: {
      VIRUS_TOTAL_API_KEY: process.env.VIRUS_TOTAL_API_KEY,
    },
  },
});

