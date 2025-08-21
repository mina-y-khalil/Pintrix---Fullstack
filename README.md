# Flask React Project (Pintrix)

<p align="center">
  <img src="https://redeem-innovations.com/wp-content/uploads/2025/07/pitrixgithub.jpg" alt="repo" />
</p>

## 🌐 Live Demo

🔗 [Visit the Live Site](https://pintrix.onrender.com/)

## 📖 Project Wiki

For a complete overview of the **Pintrix App** – including detailed feature lists, database schema, backend and frontend routes, wireframes, and system design documentation – please visit our **[Wiki](https://github.com/mina-y-khalil/Pintrix---Fullstack/wiki)**.

## Deployed using Render — this is the fully functional version of the Pintrix app.

This is the starter for the Flask React project.

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a **.env** file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the **.env** file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable. Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the **.css** files from your
   Authenticate Me project into the corresponding locations in the
   **react-vite** folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the **react-vite**
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the **dist**
   folder whenever you change your code, keeping the production version up to
   date.

For deployment instructions, please see the [Wiki: Deployment through Render](https://github.com/mina-y-khalil/Pintrix---Fullstack/wiki/Deployment-through-Render).
