require('dotenv').config(); // Carregar as variáveis de ambiente do arquivo .env

module.exports = {
  development: {
    username: "pguser",
    password: "pgpassword",
    database: "school_app",
    host: 'localhost',
    dialect: 'postgres'
  },
  test: {
    username: "pguser",
    password: "pgpassword",
    database: "school_app",
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: "pguser",
    password: "pgpassword",
    database: "school_app",
    host: 'localhost',
    dialect: 'postgres'
  }
};
