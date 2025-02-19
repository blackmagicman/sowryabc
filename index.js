const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';
const git = simpleGit();

// Make a commit on August 25, 2024
async function makeCommit() {
    const commitDate = '2024-08-25';
    const formattedDate = moment(commitDate).format('YYYY-MM-DD HH:mm:ss'); // Correct format for Git

    const data = { date: commitDate };

    try {
        // Write data to JSON file
        await new Promise((resolve, reject) => {
            jsonfile.writeFile(FILE_PATH, data, { spaces: 2 }, (err) => {
                if (err) {
                    console.error('❌ Error writing file:', err);
                    reject(err);
                } else {
                    console.log(`✅ Data written for ${commitDate}`);
                    resolve();
                }
            });
        });

        // Set commit dates
        process.env.GIT_COMMITTER_DATE = formattedDate;
        process.env.GIT_AUTHOR_DATE = formattedDate;

        // Add, commit, and push changes
        await git.add([FILE_PATH]);
        await git.commit(`Commit for ${commitDate}`, { '--date': formattedDate });
        console.log(`📌 Commit created for ${commitDate}`);

        // Push the commit to GitHub
        await git.push();
        console.log('🎉 Commit pushed to GitHub successfully!');
    } catch (err) {
        console.error('❌ Error during commit process:', err);
    }
}

// Run the commit process
makeCommit();
