const fs = require('fs');
setInterval(() => {
    fs.writeFileSync('./a', Math.random().toString())
})