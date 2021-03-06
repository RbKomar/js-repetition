var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum  = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type]=sum;

    };


    var data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };
    return{
      addItem: function(type, des, val){
          var newItem, ID;

          //create new ID
          if(data.allItems[type].length > 0){
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else{
              ID = 0;
          }

          //create new item exp or inc
          if ( type === "exp"){
              newItem = new Expense(ID, des, val);
          }else if ( type === "inc"){
              newItem = new Income(ID, des, val);
          }
          //push into our data struct
          data.allItems[type].push(newItem);
          //return the new element
          return newItem;
      },

        calculateBudget: function(){
          //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
          //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
          //calculate the percentage of spent budget
            if(data.totals.inc >0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }

        },

        getBudget: function(){
          return{
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage,
          }
        },

        testing: function(){
            console.log(data);
        }

    }

})();

var UIController = (function() {

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',

    };

    return{
        getInput : function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value,// will be either minus or plus
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            //create html with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace placeholder with the text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //insert the html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMstrings: function(){
            return DOMstrings;
        },
    }
})();

var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();


        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){

            if(e.which === 13){
                ctrlAddItem();
            }

        });
    };

    var updateBudget = function(){
        // 1. calculate the budget
            budgetCtrl.calculateBudget();
        //2. return the budget
            var budget = budgetCtrl.getBudget();
        //3. display the budget on the ui
        console.log(budget);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        //1.get the input data
            input = UICtrl.getInput();
            if(input.description !== "" && !isNaN(input.value) && input.value > 0){
                //2.add to the budget ctrl
                newItem =  budgetController.addItem(input.type, input.description, input.value);
                //3.add to the UI
                UICtrl.addListItem(newItem, input.type);
                //3.5 Clear fields
                UICtrl.clearFields();
                //4.calculate the budget and display
                updateBudget();

            }


    };


    return{
        init: function(){
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();