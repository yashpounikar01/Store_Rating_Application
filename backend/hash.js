const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = "Admin@123"; // your desired password
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
}

hashPassword();
