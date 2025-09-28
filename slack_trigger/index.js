module.exports = async function (context, req) {
    context.log('Form submission received');

    if (!req.body) {
        context.res = {
            status: 400,
            body: { error: 'No form data given' }
        };
        return;
    }

    const submission = {
        PartitionKey: "Form",                        // Required by Table Storage
        RowKey: Date.now().toString(),               // Unique ID per row
        Name: req.body.name || 'unknown user',
        Email: req.body.email || 'dummy email',
        Timestamp: new Date().toISOString()
    };

    // Save submission into Table Storage
    context.bindings.outputTable = submission;

    context.log("Saved submission:", submission);

    context.res = {
        status: 200,
        body: { success: true, saved: submission }
    };
};
