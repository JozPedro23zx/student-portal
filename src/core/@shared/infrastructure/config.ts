import { config } from "dotenv";
import { join } from "path";


export class Config{
    static env: any = null;

    static db() {
      Config.readEnv();
  
      return {
        dialect: 'sqlite' as any,
        host: Config.env.DB_HOST,
      };
    }


    static readEnv(){
        if (Config.env) {
            return;
        }

        const { parsed } = config({
            path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
        });

        Config.env = {
            ...parsed,
            ...process.env,
        };
    }
}