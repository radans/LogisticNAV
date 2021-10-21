const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid');
const Busboy = require('busboy');

// Helper to read posted form data
// through Busboy.

// Returns Promise.

exports.create = (req) => {
    return new Promise((resolve) => {
        const busboy = new Busboy({ headers: req.headers });
        let files = {}, data = {}, count = 0, finished = false;

        busboy.on('file', (fieldname, file, filename) => {
            count++;
            // Copies file into a temp file.
            const location = path.join(os.tmpdir(), uuid.v4());
            const dest = file.pipe(fs.createWriteStream(location));
            dest.on('close', () => {
                count--;
                if (count === 0 && finished) {
                    end();
                }
            });
            // Store into files object.
            // Uses array as there might be multiple files.
            files[fieldname] = files[fieldname] || [];
            files[fieldname].push({ tmp: location, name: filename });
        });

        // Collects fields into a single object.
        busboy.on('field', (fieldname, val) => {
            data[fieldname] = val;
        });

        busboy.on('finish', () => {
            if (count === 0) {
                end();
            } else {
                finished = true;
            }
        });

        const end = () => {
            resolve({ files: files, data: data });
        };

        req.pipe(busboy);
    });
};
