// budget controller
var budgetController = (function() {
    
    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems :{
            exp : [],
            inc : [],
        },
        totalItems :{
            exp: 0,
            inc: 0,
        },
    };
    
    var calculateTotal = function(type){
        // store the sum 
        var sum =0;
        // loop through the array
        data.allItems[type].forEach(function(current){
            sum = sum + current.value;  
        });
    }
    
    return {
        //create a new methods which is addItem
        addItem : function(type, des, val) {
        
            var newItem, ID;
        
            // create new ID, ID is unique for every item id = last id + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             }else{
                ID = 0;
             }
            
             // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
           
            data.allItems[type].push(newItem);
            
            return newItem;          
        }, 
        
        calculateBudget: function() {
            
            
            // calculate total income n exp
            
            // calculate budget income - expense
            
            // calculate percentage of income spent
        }
        
        testing: function(){
            console.log(data);
        }
                    
    };
             
})();


// UI controller
var UIController = (function(){
    
    // dom string - connect with HTML class
    var DOMStrings ={
        inputType : '.add__type',
        inputDescription: ".add__description",
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };
     
    return{
        
        getInput: function(){
            return{
                type : document.querySelector(DOMStrings.inputType).value,//will be inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };   
        }, 
        
        addListItem: function(obj, type){
            
            //create html string with placeholder text
            var html, newHtml, element;
            
            if (type === "inc"){
               element = DOMStrings.incomeContainer;
                
               html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%""><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
            }
          
            // replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert html to dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields : function(){
            var fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            var fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array){
                current.value = '';
                
            });
            
            fieldsArray[0].focus();
        },
        
    
        // make DOMStrings public
        getDOMStrings: function(){
            return DOMStrings;
        }
    };
   
})();



// app controller

var controller = (function(budgetCtrl, UICtrl){
    
    var setUpEventListern = function(){
        
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
            
                 ctrlAddItem();
            }
        });    
    };
    
    
    var updateBudget = function(){
        
        //calculate the budget
        
        // return the budget
        
        //display budget on UI
        
    };
    
    var ctrlAddItem = function (){
        var input, newItem;
        
        //get input data
        var input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value)) {
            
        //add item ti budget ctrl
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //add item to UI
        UICtrl.addListItem(newItem, input.type);
        
        // clear fields
        UICtrl.clearFields();
        
        // calculate and update budget
        updateBudget();   
        }
      
        
    };
    
    return {
        init: function(){
            setUpEventListern();
        }
    };
    
})(budgetController, UIController);


controller.init();
