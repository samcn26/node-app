// env
if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURL: "mongodb+srv://sam:ABCcba123!%40%23@test-node-app-ellg3.mongodb.net/test?retryWrites=true"
    }
} else {
    module.exports = {
        mongoURL: "mongodb://localhost/node-app"
    }
}