const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database');

    // Drop the old Reservations table if it exists with wrong schema
    console.log('🗑️  Dropping existing Reservations table...');
    await connection.execute('DROP TABLE IF EXISTS Reservations');
    console.log('✅ Old table dropped');

    // Create new Reservations table with correct schema
    console.log('📋 Creating new Reservations table...');
    await connection.execute(`
      CREATE TABLE Reservations (
        ReservationID INT PRIMARY KEY AUTO_INCREMENT,
        SlotID INT NOT NULL,
        UserID VARCHAR(255) NOT NULL,
        RoomID INT NOT NULL,
        ReservationDate DATE NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (SlotID) REFERENCES TimeSlots(SlotID) ON DELETE CASCADE,
        UNIQUE KEY unique_reservation (SlotID, RoomID, ReservationDate)
      )
    `);

    console.log('✅ Reservations table created with correct schema');

    await connection.end();
    console.log('🎉 Database fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixDatabase();
