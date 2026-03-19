const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrateDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database');

    // Create Reservations table if it doesn't exist
    console.log('📋 Creating/Updating Reservations table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Reservations (
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

    console.log('✅ Reservations table created/updated');

    // Create TimeSlots table if it doesn't exist
    console.log('📋 Creating/Updating TimeSlots table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS TimeSlots (
        SlotID INT PRIMARY KEY AUTO_INCREMENT,
        DayOfWeek INT NOT NULL,
        DayName VARCHAR(20),
        PeriodLabel VARCHAR(50) NOT NULL,
        PeriodNumber INT NOT NULL,
        StartTime VARCHAR(20) NOT NULL,
        EndTime VARCHAR(20) NOT NULL,
        UNIQUE KEY unique_slot (DayOfWeek, PeriodNumber)
      )
    `);

    console.log('✅ TimeSlots table created/updated');

    // Check if TimeSlots has any data, if not, insert sample data
    const [slots] = await connection.execute('SELECT COUNT(*) as count FROM TimeSlots');
    if (slots[0].count === 0) {
      console.log('📝 Inserting sample TimeSlots data...');
      const sampleSlots = [
        // Monday
        [1, 1, 'Monday', 'Period 1', 1, '7:45 AM', '8:35 AM'],
        [1, 1, 'Monday', 'Period 2', 2, '8:41 AM', '9:34 AM'],
        [1, 1, 'Monday', 'Period 3', 3, '9:40 AM', '10:30 AM'],
        [1, 1, 'Monday', 'Period 4', 4, '10:36 AM', '11:26 AM'],
        [1, 1, 'Monday', 'Period 5', 5, '11:32 AM', '12:22 PM'],
        [1, 1, 'Monday', 'Period 6', 6, '12:28 PM', '1:18 PM'],
        [1, 1, 'Monday', 'Period 7', 7, '1:24 PM', '2:14 PM'],
        [1, 1, 'Monday', 'Period 8', 8, '2:20 PM', '3:10 PM'],
        // Tuesday
        [2, 2, 'Tuesday', 'Period 1', 1, '7:45 AM', '8:30 AM'],
        [2, 2, 'Tuesday', 'Period 2', 2, '8:35 AM', '9:20 AM'],
        [2, 2, 'Tuesday', 'SOAR', 3, '9:25 AM', '10:10 AM'],
        [2, 2, 'Tuesday', 'Period 3', 4, '10:15 AM', '11:00 AM'],
        [2, 2, 'Tuesday', 'Period 4', 5, '11:05 AM', '11:50 AM'],
        [2, 2, 'Tuesday', 'Period 5', 6, '11:55 AM', '12:40 PM'],
        [2, 2, 'Tuesday', 'Period 6', 7, '12:45 PM', '1:30 PM'],
        [2, 2, 'Tuesday', 'Period 7', 8, '1:35 PM', '2:20 PM'],
        [2, 2, 'Tuesday', 'Period 8', 9, '2:25 PM', '3:10 PM'],
        // Wednesday
        [3, 3, 'Wednesday', 'Period 1', 1, '9:00 AM', '9:42 AM'],
        [3, 3, 'Wednesday', 'Period 2', 2, '9:47 AM', '10:29 AM'],
        [3, 3, 'Wednesday', 'Period 3', 3, '10:34 AM', '11:16 AM'],
        [3, 3, 'Wednesday', 'Period 4', 4, '11:21 AM', '12:03 PM'],
        [3, 3, 'Wednesday', 'Period 5', 5, '12:08 PM', '12:49 PM'],
        [3, 3, 'Wednesday', 'Period 6', 6, '12:54 PM', '1:36 PM'],
        [3, 3, 'Wednesday', 'Period 7', 7, '1:41 PM', '2:23 PM'],
        [3, 3, 'Wednesday', 'Period 8', 8, '2:28 PM', '3:10 PM'],
        // Thursday
        [4, 4, 'Thursday', 'Period 1', 1, '7:45 AM', '8:30 AM'],
        [4, 4, 'Thursday', 'Period 2', 2, '8:35 AM', '9:20 AM'],
        [4, 4, 'Thursday', 'SOAR', 3, '9:25 AM', '10:10 AM'],
        [4, 4, 'Thursday', 'Period 3', 4, '10:15 AM', '11:00 AM'],
        [4, 4, 'Thursday', 'Period 4', 5, '11:05 AM', '11:50 AM'],
        [4, 4, 'Thursday', 'Period 5', 6, '11:55 AM', '12:40 PM'],
        [4, 4, 'Thursday', 'Period 6', 7, '12:45 PM', '1:30 PM'],
        [4, 4, 'Thursday', 'Period 7', 8, '1:35 PM', '2:20 PM'],
        [4, 4, 'Thursday', 'Period 8', 9, '2:25 PM', '3:10 PM'],
        // Friday
        [5, 5, 'Friday', 'Period 1', 1, '7:45 AM', '8:35 AM'],
        [5, 5, 'Friday', 'Period 2', 2, '8:41 AM', '9:34 AM'],
        [5, 5, 'Friday', 'Period 3', 3, '9:40 AM', '10:30 AM'],
        [5, 5, 'Friday', 'Period 4', 4, '10:36 AM', '11:26 AM'],
        [5, 5, 'Friday', 'Period 5', 5, '11:32 AM', '12:22 PM'],
        [5, 5, 'Friday', 'Period 6', 6, '12:28 PM', '1:18 PM'],
        [5, 5, 'Friday', 'Period 7', 7, '1:24 PM', '2:14 PM'],
        [5, 5, 'Friday', 'Period 8', 8, '2:20 PM', '3:10 PM'],
      ];

      for (const slot of sampleSlots) {
        await connection.execute(
          'INSERT INTO TimeSlots (DayOfWeek, DayName, PeriodLabel, PeriodNumber, StartTime, EndTime) VALUES (?, ?, ?, ?, ?, ?)',
          slot
        );
      }
      console.log('✅ Sample data inserted');
    }

    await connection.end();
    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateDatabase();
