const fs = require('fs')
const path = require('path')

module.exports = async function(context,req){
    context.log('Form submission done')
    if(!req.body){
        context.res = {
            status:400,
            body: {error: 'No form data given'}
        }
        return
    }
    const submission ={
        name : req.body.name || 'unknown user',
        email : req.body.email || 'dummy email',
        timestamp : new Date().toISOString()
    }
    const filePath = path.join(__dirname,"submissions.json")
     let submissions = [];
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath);
        submissions = JSON.parse(rawData);
    }

    // Add new submission
    submissions.push(submission);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

    context.log("Saved submission:", submission);

    context.res = {
        status: 200,
        body: { success: true, saved: submission }
    };
}