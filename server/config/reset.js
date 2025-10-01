import pool from "./database.js";
import dotenv from "./dotenv.js";
import guideData from "../data/guideData.js";

const createGuideTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS guides;

    CREATE TABLE IF NOT EXISTS guides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        text VARCHAR NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        submittedBy VARCHAR(255) NOT NULL
    )
`;
  try {
    const res = await pool.query(createTableQuery);
    console.log("🎉 guides table created successfully");
  } catch (err) {
    console.error("⚠️ error creating guides table", err);
  }
};

const seedGuideTable = async () => {
  await createGuideTable();
  guideData.forEach((guide) => {
    const insertQuery = {
      text: "INSERT INTO guides (title, text, category, image, submittedBy) VALUES ($1, $2, $3, $4, $5)",
    };
    const values = [
      guide.title,
      guide.text,
      guide.category,
      guide.image,
      guide.submittedBy,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.log("⚠️ error inserting guides", err);
        return;
      }

      console.log(`✅ ${guide.title} added successfully`);
    });
  });
};
seedGuideTable();
