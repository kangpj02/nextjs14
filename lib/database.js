import mysql from "mysql2/promise";

const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   waitForConnections: true,
   connectionLimit: 10,
});

if (process.env.NODE_ENV === "development") {
   (async () => {
      try {
         const conn = await pool.getConnection();
         console.log("Connected to db...!");
         conn.release();
      } catch (err) {
         console.error("DB connection error", err);
      }
   })();
}

export async function db(query, params = []) {
   try {
      const [rows] = await pool.query(query, params);
      return rows;
   } catch (err) {
      console.log("Error in executing the query");
      throw err;
   }
}
