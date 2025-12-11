# 📝 **THESIS MANAGEMENT SYSTEM**

A web application designed to digitize and simplify the thesis management process, archiving, guiding students and faculty from proposal submission to final defense through a structured, role-based workflow.


- **Note:** this project was made purely for **Academic Purposes Only**


## 🔧 Prerequisites

Ensure you have the following tools installed on your system:

1. **Git**: [Download Git](https://git-scm.com/)
2. **Composer**: [Download Composer](https://getcomposer.org/)
3. **Node.js and npm**: [Download Node.js](https://nodejs.org/) (npm is included with Node.js)
4. **PHP development environment**: Use XAMPP, HERD, or set up PHP & a web server manually.

- **Note:** It is recommended to use XAMPP if you are new, as it provides a simple and easy setup.

## ⚙️ Installation & Setup

Follow these steps to get the application up and running locally:

1. Clone the project repository

   ```sh
   git clone https://github.com/LEGENDFVRYz/thesis-management-system.git
   cd thesis-management-system
   ```

2. Clone the project repository

   ```sh
   git checkout -b <your-initials-plus-lastname>     #Ex. "sljcruz" "cakvillanueva"
   git pull origin main
   git pull origin staging
   ```

3. Install Backend and Frontend Dependencies

   ```sh
   composer install
   npm install
   ```

4. Configure Environment Variables for applications

   - Create .env files

   ```sh
   /* copy for Windows; cp for Unix-based systems */
   copy .env.example .env
   ```

   - Update the necessary variables based on your setup

5. Generate Application Key

   ```sh
   php artisan key:generate
   ```

6. Run Database Migrations and Data Seeder

   ```sh
   php artisan migrate --seed
   ```

7. Start the Development Servers

   ```sh
   composer run dev
   ```

8. Access the applications
   - http://127.0.0.1:8000

   **Note:** You may change the application URL in the .env file if the default address is not available.

