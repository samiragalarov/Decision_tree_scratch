//const BigNumber = require('bignumber.js');

const training_data = [
    ['Green', 3, 'Apple'],
    ['Yellow', 3, 'Apple'],
    ['Red', 1, 'Grape'],
    ['Red', 1, 'Grape'],
    ['Yellow', 3, 'Lemon'],
]

const header = ["color", "diameter", "label"]

///"""Find the unique values for a column in a dataset."""
function unique_vals(rows, col) {
    const Arr = [];
    const h = [];
    for (let i = 0; i < rows.length; i++) {
        Arr.push(rows[i][col]);
    }
    const uniq = [...new Set(Arr)];

    return uniq;
}
//console.log(unique_vals(training_data, 0))


/// """Counts the number of each type of example in a dataset."""
function class_counts(rows) {


    const key = [];
    const value = [];
    if (rows[0] == undefined){
        return

    }
    const Index = rows[0].length -1

    const object = {}

    for (let i = 0; i < rows.length; i++) {
        let count = 0;
        for (let k = 0; k < rows.length; k++) {
            if (rows[i][Index] == rows[k][Index]) {
                count += 1;

            }
        }
        //console.log(count)
        key.push(rows[i][Index]);
        value.push(count);
    }


    for (let i = 0; i < key.length; i++) {
        object[key[i]] = value[i];
    }
    return object
}
console.log(class_counts(training_data))


class Question {
    constructor(column, value) {
        this.column = column;
        this.value = value;
    }

    match(example) {
        const val = example[this.column];
        if (val == "number") {
            return val >= this.value;

        } else {
            return val == this.value;
        }
    }

    print() {
        let condition = "==";
        if (typeof training_data[0][this.column] === "number") {
            condition = ">=";
        }
        return `${header[this.column]} ${condition} ${this.value}`;
    }
}
// const quiz = new Question(1,1)
// console.log(quiz.print())
// const example = training_data[1]
// console.log(quiz.match(example))



///"""Partitions a dataset.
function partition(rows, question) {
    const true_rows = [];
    const false_rows = [];


    for (let i = 0; i < rows.length; i++) {
        if (question.match(rows[i])) {
            true_rows.push(rows[i]);
        } else {
            false_rows.push(rows[i]);
        }

    }
    return [true_rows, false_rows];
}

//console.log(partition(training_data,new Question(1, 3)))


function gini(rows) {


    counts = class_counts(rows);
    //console.log(counts)
    impurity = 1;

    for (const lbl in counts) {
        let prob_of_lbl = counts[lbl] / (rows.length).toFixed(2);
        impurity -= prob_of_lbl ** 2;

    }
    return impurity;
}

const no_mixing = [['Apple'], ['Orange'], ['Grape'], ['Grapefruit'], ['Blueberry']];

function info_gain(left, right, current_uncertainty) {
    const p = (left.length).toFixed(2) / ((left.length) + (right.length));
    return current_uncertainty - (p * gini(left)) - (1 - p) * gini(right);

}


// let current_uncertainty = gini(training_data);

// let a = partition(training_data,new Question(0,"Green"));
// let true_rows = a[0];
// let false_rows = a[1];
//console.log(info_gain(true_rows,false_rows,current_uncertainty));


function find_best_split(rows) {
    let best_gain = 0;
//class_counts
    let best_question;

   
    let current_uncertainty = gini(rows);

    const n_features = (rows[0]).length - 1

    for (let i = 0; i < n_features; i++) {
        let values = unique_vals(training_data, i);


        for (let k = 0; k < values.length; k++) {
            let question = new Question(i, values[k]);
            //   console.log(question)
            let all = partition(rows, question);
            let true_rows = all[0];
            let false_rows = all[1];

            if (true_rows.length == 0 && false_rows.length == 0) {
                continue
            }


            let gain = info_gain(true_rows, false_rows, current_uncertainty);


            if (gain > best_gain) {
                best_gain = gain;
                best_question = question;
            }

        }

    }



    return [best_gain, best_question];


}
//console.log(find_best_split(training_data))



class Leaf {
    constructor(rows) {
        this.predictions = class_counts(rows)

    }

}

class Decision_Node {
    constructor(question,true_branch,false_branch){
        this.question = question
        this.true_branch = true_branch
        this.false_branch = false_branch
    }
}

function build_tree(rows) {
  
    let sp = find_best_split(rows)
    let gain = sp[0];
    let question = sp[1];

   
    if (gain == 0) {
        return new Leaf(rows)
    }

    let part = partition(rows, question)
    let true_rows = part[0];
    let false_rows = part[1];


    let true_branch = build_tree(true_rows);
    let false_branch = build_tree(false_rows);

    return new Decision_Node(question, true_branch, false_branch)
}
console.log(build_tree(training_data))



