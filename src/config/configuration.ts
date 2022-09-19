const config: object = {
  dialect: "mysql",
  host: process.env.DATABASE_HOST || "localhost",
  username: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || "bossraidgame",
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  models: [],
}
export default config