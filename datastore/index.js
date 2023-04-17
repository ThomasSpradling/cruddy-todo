const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

/*

create('hello', (err, obj) => {
  if err: console.log(err)
  else:
    obj.id
    obj.text
})

fs.readFile(filename, (err, data) => {
  if err: console.log(err)
  else:
    console.log(data)
})

*/

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
      return;
    }
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (error) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  // [00001.txt, 00002.txt] ---> [00001, 00002] ---> [{ id: 00001, text: 00001 }, { id: 00002, text: 00002 }]
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      callback(null,
        files
          .map(file => file.slice(0,5))
          .map(id => ({id: id, text: id}))
      );
    }
  });
  // ['counter.js', 'index.js']
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(err);
    } else if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null,{ id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  fs.readdir(exports.dataDir, (err, files) => {
    if (!files.includes(`${id}.txt`)) {
      callback(`No item with id: ${id}`);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  fs.unlink(`${exports.dataDir}/${id}.txt`, err => {
    if (err) {
      callback(`No item with id: ${id}`);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
