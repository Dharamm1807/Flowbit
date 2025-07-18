# FlowbitTable of Contents
Overview
Features
Project Structure
Project Index
Getting Started
Prerequisites
Installation
Usage
Testing
Project Roadmap
Contributing
License
Acknowledgments

Project Structure
└── Flowbit.git/
    ├── README.md
    ├── api
    │   ├── .dockerignore
    │   ├── Dockerfile
    │   ├── config
    │   ├── middleware
    │   ├── models
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   ├── seed.js
    │   ├── server.js
    │   ├── tests
    │   └── utils
    ├── docker-compose.yml
    ├── package.json
    ├── shell
    │   ├── .babelrc
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── src
    │   └── webpack.config.js
    └── tickets
        ├── .babelrc
        ├── Dockerfile
        ├── package-lock.json
        ├── package.json
        ├── src
        └── webpack.config.js

Project Index
FLOWBIT.GIT/
__root__
shell
tickets
api
Getting Started
Prerequisites
Before getting started with Flowbit.git, ensure your runtime environment meets the following requirements:

Programming Language: JavaScript
Package Manager: Npm
Container Runtime: Docker
Installation
Install Flowbit.git using one of the following methods:

Build from source:

Clone the Flowbit.git repository:
❯ git clone https://github.com/Dharamm1807/Flowbit.git

Navigate to the project directory:
❯ cd Flowbit.git

Install the project dependencies:
Using npm   

❯ npm install

Using docker   

❯ docker build -t Dharamm1807/Flowbit.git .

Usage
Run Flowbit.git using the following command: Using npm   

❯ npm start

Using docker   

❯ docker run -it {image_name}
