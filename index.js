#!/usr/bin/env node

const inquirer = require('inquirer'),
    fs = require('fs'),
    request = require('request'),
    _ = require('underscore'),
    ora = require('ora'),
    showdown = require('showdown')

const questions = [
    // {
    //     type: 'input',
    //     name: 'date',
    //     message: 'date',
    //     default: new Date().toDateString()
    // },
    // {
    //     type: 'input',
    //     name: 'companyname',
    //     message: 'Company Name:',
    //     default: 'Benjamin Wasilewski'
    // },
    // {
    //     type: 'input',
    //     name: 'customername',
    //     message: 'Customer Name:'
    // },
    // {
    //     type: 'input',
    //     name: 'customeraddress',
    //     message: 'Customer Address:'
    // },
    // {
    //     type: 'input',
    //     name: 'total',
    //     message: 'Total ($):',
    //     validate (value) {
    //         return isNumber(value)
    //     }
    // },
    {
        type: 'list',
        name: 'paymentterms',
        message: 'Payment Terms:',
        choices: [
            'Due Upon Receipt',
            'Net 15',
            'Net 30'
        ]
    },
    // {
    //     type: 'input',
    //     name: 'overdueinterest',
    //     message: 'Overdue Interest (%):',
    //     validate (value) {
    //         return isNumber(value)
    //     },
    //     default: 10
    // }
],
    temp_answers = {
        companyname: 'BTW',
        customername: 'Farva Jafri',
        customeraddress: '123 Happy Lane',
        total: '550',
        paymentterms: 'Lorem Ipsum',
        overdueinterest: '10%',
        date: new Date().toDateString()
    }
    spinner = ora('Getting template from Github'),
    template_name = "Contract Template.md"

let template


initialize()


function initialize () {
    var opts = {
        url: 'https://api.github.com/gists/5418781',
        headers: {
            'User-Agent': 'bwasilewski'
        }
    }
    spinner.start();
    request(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            spinner.succeed('Template downloaded successfully')
            template = JSON.parse(body).files[template_name].content
            beginPrompts(template)
        } else {
            spinner.fail('Something went wrong. Are you sure you entered the Gist ID correctly?')
        }
    })
}

function isNumber (value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
}

function beginPrompts (template) {
    inquirer.prompt(questions).then(answers => {
        let html = new showdown.Converter().makeHtml(template),
            htmltemplate = _.template(html)

        writeToTemp(htmltemplate(temp_answers))
    })
}

function writeToTemp(html) {
    let wrapper = ''

    fs.readFile('./src/wrapper.html', 'utf-8', function (error, data) {
        wrapper = data.replace('<div id="wrapper-inner"></div>', html)

        fs.writeFile('./dist/output.html', wrapper, error => {
            if (error) {
                return console.log(error)
            }
            console.log('File saved successfully!');
        })
    })
}