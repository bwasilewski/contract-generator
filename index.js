#!/usr/bin/env node

/**
 * Module dependencies.
 */

let inquirer = require('inquirer'),
    fs = require('fs'),
    request = require('request'),
    markd = require('markedejs'),
    ejs = require('ejs-html'),
    ora = require('ora'),
    spinner = ora('Getting template from Github'),
    template_name = "Contract Template.md",
    questions = [
        {
            type: 'input',
            name: 'date',
            message: 'date',
            default: new Date().toDateString()
        },
        {
            type: 'input',
            name: 'company_name',
            message: 'Company Name:',
            default: 'Benjamin Wasilewski'
        },
        {
            type: 'input',
            name: 'customer_name',
            message: 'Customer Name:'
        },
        {
            type: 'input',
            name: 'customer_address',
            message: 'Customer Address:'
        },
        {
            type: 'input',
            name: 'total',
            message: 'Total ($):',
            validate (value) {
                return isNumber(value)
            }
        },
        {
            type: 'list',
            name: 'payment_terms',
            message: 'Payment Terms:',
            choices: [
                'Due Upon Receipt',
                'Net 15',
                'Net 30'
            ]
        },
        {
            type: 'input',
            name: 'overdue_interest',
            message: 'Overdue Interest (%):',
            validate (value) {
                return isNumber(value)
            },
            default: 10
        }
    ],
    template



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
        markd.render(template, answers, function (error, html) {
            if (!error) {
                writeToTemp(html)
            } else {
                console.log('Error: ', error)
            }
        })
    })
}

function writeToTemp(html) {
    fs.writeFile('./.temp/output.html', html, error => {
        if (error) {
            return console.log(error)
        }
    })
    console.log('File saved successfully!')
}