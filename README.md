## Http api using Nodejs, Express,  MongoDB

clone the project

### Install dependencies
* npm install

### Run

* npm run start

## Make Requests

| Method        | Route                                                                 | Return                                                |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------     |
| Get           | localhost:3000/products                                               | All records                                           |
| Get           | localhost:3000/products/EXISTING_KEY                                  | Records with matching EXISTING_KEY                    |
| Get           | localhost:3000/products/EXISTING_KEY?timestamp = TIME_STAMP           | Records with matching EXISTING_KEY and TIME_STAMP     |
| POST          | localhost:3000/products                                               | Records with specified {key: KEY_VALUE, value: Value} |
| Delete          | localhost:3000/products/RECORD_ID                                     | Records with specified key will be removed            |

## Requirements
node, npm

