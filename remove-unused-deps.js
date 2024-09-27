const { exec } = require("child_process");
const fs = require("fs");

fs.readFile("unused-deps.json", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const { dependencies, devDependencies } = JSON.parse(data);
    const allUnusedDeps = [...dependencies, ...devDependencies];

    if (allUnusedDeps.length === 0) {
        console.log("No unused dependencies or devDependencies found.");
        return;
    }

    const uninstallCommand = `npm uninstall ${allUnusedDeps.join(" ")}`;
    exec(uninstallCommand, (err, stdout) => {
        if (err) {
            console.error("Error uninstalling dependencies:", err);
            return;
        }
        console.log("Unused dependencies and devDependencies removed successfully.");
        console.log(stdout);
    });

    const removeFileCommand = "rm unused-deps.json";
    exec(removeFileCommand, (err, stdout) => {
        if (err) {
            console.error("Error removing unused-deps.json file:", err);
            return;
        }
        console.log("unused-deps.json file removed successfully.");
        console.log(stdout);
    });
});