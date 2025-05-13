## Project Notes 📝
I used Vite to create my React app, which was a new tool to me, but it seemed to work as expected. I used Prisma as my ORM, and `brew` to start my PostgreSQL service. I went with Octokit.js as my GitHub SDK, and CSS for styling.

### Backend Setup:
1) `brew services start postgresql`

2) `npx prisma migrate dev --name init`

3) `npx prisma generate`

4) Add an `.env` file to `backend/` with the following:
```
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/repo-track-db?schema=public"
GITHUB_TOKEN="ghp_****"
```
5) `npm run dev`

### Frontend Setup:
1) `npm run dev`


### Future Improvements:

1) Setup a test case to ensure the ‘Refresh Repo’ functionality is consistently working
2) Improve type setting on the frontend
3) Create Authentication to personalize tracked repos for specific users
4) Implement Material UI components

# Thank you! 🚀