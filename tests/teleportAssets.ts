import { equal } from "assert";

const { exec } = require("child_process");

describe('Teleport Assets', () => {
  describe('DMP', () => {
    it('should teleport assets from Relay Chain to Parachain', (done) => {
      exec("yarn dev dmp local teleport-asset -s //Alice -p 1000 -b //Bob -a 1000000000000 -f 0", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            done()
        } 
        else if (stderr) {
            console.log(`stderr: ${stderr}`);
            // done()
        }
        console.log(`stdout: ${stdout}`);
        
        // equal(true, true); 
      });  
    });
    
  });
});