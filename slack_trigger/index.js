const { TableClient, AzureSASCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log("Form submission received");

    if (!req.body) {
        context.res = {
            status: 400,
            body: { error: "No form data given" }
        };
        return;
    }

    const connectionString = 'DefaultEndpointsProtocol=https;AccountName=allyworkspace;AccountKey=fm/FrAaUVoCoywT+X/oTvdTNXLnUiTtQDF80VL2MCASS2coPPHcwrm8l96ufm52uEj2wSx1ra2gW+AStPU9ymQ==;EndpointSuffix=core.windows.net' ;
    const tableName = "FormSubmissions";

    // Create Table client
    const { TableClient } = require("@azure/data-tables");
    const tableClient = TableClient.fromConnectionString(connectionString, tableName);

    // Ensure table exists
    await tableClient.createTable();

    // Build submission entity
    const submission = {
        partitionKey: "Form",
        rowKey: Date.now().toString(),
        name: req.body.name || "unknown user",
        email: req.body.email || "dummy email",
        timestamp: new Date().toISOString()
    };

    // Insert into Table
    await tableClient.createEntity(submission);

    context.log("Saved submission:", submission);

    context.res = {
        status: 200,
        body: { success: true, saved: submission }
    };
};
