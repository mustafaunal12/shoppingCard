# shoppingCard

# npm install

# npm run test       # writes test results to testResults/test-result.xml in root directory 

# npm run coverage   # writes test coverage results to terminal

# npm start          # runs print function with dummy data and writes results to terminal

# launch.json for visual studio code
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/app.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Tests",
            "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
            "args": [
                "-u",
                "bdd",
                "--timeout",
                "999999",
                "--colors",
                "${workspaceFolder}/test"
            ],
            "internalConsoleOptions": "openOnSessionStart"
        }
    ]
}

