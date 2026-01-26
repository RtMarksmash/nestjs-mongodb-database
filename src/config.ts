import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
    },
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };
});
