import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log("Welcome to TechieNg's Calculator\n");
const calculate = () => {
  rl.question(
    'Select operation:\n1. Add\n2. Subtract\n3. Multiply\n4. Divide\n5. Exit \n6.Enter Math Expression e.g (2 + 3 * 4)\nEnter choice (1-6):',
    (input) => {
      validateChoice(input);
      const choice = parseInt(input);

      if (choice === 5) {
        rl.close();
      } else if (choice >= 1 && choice <= 4) {
        getFirstNumber(choice);
      } else if (choice === 6) {
        evaluateMathExpression();
      }
    }
  );
};
calculate();

const validateChoice = (choice) => {
  if (isNaN(choice) || choice < 1 || choice > 6) {
    console.log('Error: Invalid input, please select a number between 1 and 5');
    calculate();
  }
};
const evaluateMathExpression = () => {
  rl.question('Enter the math expression: ', (expression) => {
    /* Tokenize input: numbers, operators, parentheses
return an array similar to the one below
  ['3', ' ', '/', ' ', '4',
    ' ', '/', ' ', '2', ' ',
    '*', ' ', '3', '+', '4',
    '-', '5'
  ]
    */
    const tokens =
      expression.match(/\d+\.?\d*|[+\-*/()]|\s+/g)?.filter(Boolean) || [];
    const outputQueue = [];
    const operatorStack = [];
    const precedence = operatorPrecedenceMap;
    const associativity = { '+': 'L', '-': 'L', '*': 'L', '/': 'L' };
    //for each token in the array of token, if the token is a number then we push it to the output queue else we apply the operator precedence and associativity rules to the operator stack

    for (const token of tokens) {
      if (/^\d/.test(token)) {
        outputQueue.push(token);
      } else if (token in precedence) {
        //if the token is an operator, we pop operators from the operator stack to the output queue until the operator stack is empty or the operator at the top of the stack has lower precedence or the operator at the top of the stack is a left associative operator and the current operator has lower precedence
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] in precedence &&
          ((associativity[token] === 'L' &&
            precedence[token] <=
              precedence[operatorStack[operatorStack.length - 1]]) ||
            (associativity[token] === 'R' &&
              precedence[token] <
                precedence[operatorStack[operatorStack.length - 1]]))
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        //if the token is a left parenthesis, we push it to the operator stack
        operatorStack.push(token);
      } else if (token === ')') {
        //if the token is a right parenthesis, we pop operators from the operator stack to the output queue until the operator stack is empty or the operator at the top of the stack is a left parenthesis
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== '('
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop(); // Remove '('
      }
    }
    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    //for each token in the output queue, if the token is a number then we push it to the stack else we pop two numbers from the stack and apply the operator to the two numbers and push the result back to the stack
    const stack = [];
    for (const token of outputQueue) {
      if (/^\d/.test(token)) {
        stack.push(Number(token));
      } else if (token in symbolFunctionMap) {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) {
          console.log('Error: Invalid expression.');
          rl.close();
          return;
        }
        stack.push(symbolFunctionMap[token](a, b));
      }
    }
    //if the stack has only one element, then we have a valid expression and we print the result else we have an invalid expression and we log an error
    if (stack.length === 1) {
      console.log(`The result of the expression ${expression} is ${stack[0]}`);
    } else {
      console.log('Error: Invalid expression.');
    }
    rl.close();
  });
};
// function to get inputs
const getFirstNumber = (choice) => {
  rl.question('Enter the first number: ', (a) => {
    if (isNaN(a)) {
      console.log('Error: Invalid input, please enter a number');
      // if is not a number recursively request for input
      getFirstNumber(choice);
    } else {
      const getSecondNumber = () => {
        rl.question('Enter the second number: ', (b) => {
          if (isNaN(b)) {
            console.log('Error: Invalid input, please enter a number');
            // if is not a number recursively request for input
            return getSecondNumber();
          } else if (choice === 4 && Number(b) === 0) {
            // if is entered number is 0 and operation is division , log error and  recursively request for input
            console.log('Error: Division by zero');

            return getSecondNumber();
          } else {
            getFunction[choice](a, b);
            rl.close();
          }
        });
      };
      getSecondNumber();
    }
  });
};

// addition function
const add = (a, b) => {
  console.log(`The sum of ${a} and ${b} is ${Number(a) + Number(b)}`);
  return Number(a) + Number(b);
};
//Subtraction function
const subtract = (a, b) => {
  console.log(`The difference of ${a} and ${b} is ${a - b}`);
  return Number(a) - Number(b);
};
//multiplication function
const multiply = (a, b) => {
  console.log(`The product of ${a} and ${b} is ${a * b}`);
  return Number(a) * Number(b);
};

// Division function
const divide = (a, b) => {
  console.log(`The quotient of ${a} and ${b} is ${a / b}`);
  return Number(a) / Number(b);
};

// object map for operations to make selection easier and reduce boiler plate
const getFunction = {
  1: add,
  2: subtract,
  3: multiply,
  4: divide,
};

// helper object to map symbols to their respective function for expression evaluation
const symbolFunctionMap = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};
// helper object to map symbols to their order of precedence
const operatorPrecedenceMap = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};
